import { HttpStatus, Injectable } from '@nestjs/common'
import { Brackets } from 'typeorm'
import { firstValueFrom } from 'rxjs'
import { compareSync } from 'bcryptjs'
import { HttpService } from '@nestjs/axios'
import { CustomService } from '@/service/custom.service'
import { CacheCustomer } from '@/cache/cache-common.service'
import { DataBaseService } from '@/service/database.service'
import { divineIntNumber, divineIntStringer, divineResult } from '@/utils/utils-common'
import { divineCatchWherer, divineCreateJwtToken } from '@/utils/utils-plugin'
import { divineOmitDatePatter } from '@/utils/utils-process'
import { custom } from '@/utils/utils-configer'
import * as http from '@common/interface/customer.resolver'

@Injectable()
export class CustomerService extends CustomService {
	constructor(
		private readonly cacheCustomer: CacheCustomer,
		private readonly dataBase: DataBaseService,
		private readonly httpService: HttpService
	) {
		super()
	}

	/**注册用户**/
	public async httpRegisterCustomer(state: http.RegisterCustomer) {
		/**验证手机号**/
		await this.validator(this.dataBase.tableCustomer, {
			where: { mobile: state.mobile }
		}).then(async data => {
			return await divineCatchWherer(Boolean(data), {
				message: '手机号已注册',
				code: HttpStatus.BAD_REQUEST
			})
		})
		/**用户数据入库**/
		return await this.customeCreate(this.dataBase.tableCustomer, {
			uid: await divineIntNumber(18),
			nickname: state.nickname,
			password: state.password,
			mobile: state.mobile
		}).then(async node => {
			await this.customeCreate(this.dataBase.tableCustomerConfigur, {
				uid: node.uid,
				credit: 0,
				current: 0,
				balance: 0,
				authorize: 'initialize',
				apiKey: await divineIntStringer(32),
				apiSecret: await divineIntStringer(32)
			})
			return await divineResult({ message: '注册成功' })
		})
	}

	/**登录**/
	public async httpAuthorizeCustomer(state: http.AuthorizeCustomer, referer: string) {
		/**验证码校验**/
		await firstValueFrom(
			this.httpService.request({
				baseURL: `http://${custom.ipv4}:${custom.captchar.port}`,
				url: `${custom.captchar.prefix}/browser/authorize/checker`,
				method: 'POST',
				headers: { origin: referer },
				data: {
					appSecret: 'zzFznmt8DY64hHBnkoboTmUzFZIadSdV',
					appId: '169851019895347735',
					session: state.session,
					token: state.token
				}
			})
		).then(async ({ data }) => {
			return await divineCatchWherer(data.code !== HttpStatus.OK || !data.data.check, {
				message: data.message
			})
		})

		/**查询登录用户**/
		const node = await this.customeBuilder(this.dataBase.tableCustomer, async qb => {
			qb.addSelect('tb.password')
			qb.where('tb.mobile = :mobile', { mobile: state.mobile })
			qb.andWhere('tb.status IN(:...status)', { status: ['enable', 'disable'] })
			return await qb.getOne()
		}).then(async data => {
			await divineCatchWherer(!Boolean(data), {
				message: '用户未注册'
			})
			await divineCatchWherer(data.status === 'disable', {
				message: '账户已被禁用'
			})
			await divineCatchWherer(!compareSync(state.password, data.password), {
				message: '账户密码错误'
			})
			return data
		})

		/**生成token**/
		return await divineCreateJwtToken({
			expire: custom.jwt.expire ?? 7200,
			secret: custom.jwt.secret,
			data: {
				keyId: node.keyId,
				uid: node.uid,
				nickname: node.nickname,
				password: node.password,
				status: node.status
			}
		}).then(async ({ token, expire }) => {
			await this.cacheCustomer.setCustomer(node.uid, { ...node })
			return await divineResult({ token, expire, message: '登录成功' })
		})
	}

	/**获取用户信息**/
	public async httpResolverCustomer(state: http.ResolverCustomer) {
		const node = await this.cacheCustomer.checkCustomer(state.uid, ['disable']).then(async node => {
			return await divineOmitDatePatter(node, ['password'])
		})
		return await this.cacheCustomer.getConfigur(state.uid).then(async data => {
			return await divineResult({
				...node,
				apiKey: data.apiKey ?? null,
				apiSecret: data.apiSecret ?? null,
				authorize: data.authorize ?? 'initialize',
				credit: data.credit ?? 0,
				current: data.current ?? 0,
				balance: data.balance ?? 0
			})
		})
	}
}
