import { HttpStatus, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { HttpService } from '@nestjs/axios'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Brackets } from 'typeorm'
import { compareSync } from 'bcryptjs'
import { CustomService } from '@/service/custom.service'
import { RedisService } from '@/service/redis.service'
import { TableCustomer } from '@/entity/tb-common.customer'
import { TableCustomerConfigur } from '@/entity/tb-common.customer__configur'
import { divineIntNumber, divineResult } from '@/utils/utils-common'
import { divineCatchWherer, divineCreateJwtToken } from '@/utils/utils-plugin'
import { custom } from '@/utils/utils-configer'
import * as http from '@common/interface/customer.resolver'

@Injectable()
export class CustomerService extends CustomService {
	constructor(
		private readonly configService: ConfigService,
		private readonly httpService: HttpService,
		private readonly redisService: RedisService,
		@InjectRepository(TableCustomer) public readonly tableCustomer: Repository<TableCustomer>,
		@InjectRepository(TableCustomerConfigur) public readonly tableCustomerConfigur: Repository<TableCustomerConfigur>
	) {
		super()
	}

	/**用户校验**/
	public async httpCheckCustomer(state: { uid: string; command: Array<string> }) {
		return await this.validator(this.tableCustomer, {
			message: '账户不存在',
			join: { alias: 'tb' },
			where: new Brackets(qb => {
				qb.where('tb.uid = :uid', { uid: state.uid })
				qb.andWhere('tb.status IN(:...status)', { status: ['enable', 'disable'] })
			})
		}).then(async data => {
			await divineCatchWherer(state.command.includes(data.status), {
				message: '账户已被禁用'
			})
			return await divineResult(data)
		})
	}

	/**注册用户**/
	public async httpRegisterCustomer(state: http.RegisterCustomer) {
		// return await this.validator(this.tableCustomer, {
		// 	where: { uid: '169848335712346764' }
		// }).then(async data => {
		// 	const configur = await this.customeCreate(this.tableCustomerConfigur, {
		// 		authorize: 'initialize',
		// 		credit: 0,
		// 		current: 0,
		// 		balance: 0
		// 	})
		// 	await this.customeUpdate(this.tableCustomer, { uid: data.uid }, { configur: configur as never })
		// })
		const node = await this.tableCustomer.create({
			uid: await divineIntNumber(18),
			nickname: '宫新哲',
			password: 'MTIzNDU1',
			mobile: '18888888888'
		})
		return await this.tableCustomer.save(node)
	}

	/**登录**/ //prettier-ignore
	public async httpAuthorizeCustomer(state: http.AuthorizeCustomer, referer: string) {
		await this.httpService.axiosRef.request({
			baseURL: `http://127.0.0.1:${custom.captchar.port ?? 5030}`,
			url: `${custom.captchar.prefix}/browser/authorize/checker`,
			method: 'POST',
			headers: { origin: referer },
			data: {
				appSecret: 'zzFznmt8DY64hHBnkoboTmUzFZIadSdV',
				appId: '169851019895347735',
				session: state.session,
				token: state.token,
			}
		}).then(async ({ data }) => {
			await divineCatchWherer(data.code !== HttpStatus.OK || !data.data.check, {
				message: data.message
			})
			return data
		})
		return await this.validator(this.tableCustomer, {
			message: '账户不存在',
			select: ['keyId', 'uid', 'nickname', 'mobile', 'email', 'password', 'status'],
			join: { alias: 'tb' },
			where: new Brackets(qb => {
				qb.where('tb.mobile = :mobile', { mobile: state.mobile })
				qb.andWhere('tb.status IN(:...status)', { status: ['enable', 'disable'] })
			})
		}).then(async data => {
			await divineCatchWherer(data.status === 'disable', {
				message: '账户已被禁用'
			})
			await divineCatchWherer(!compareSync(state.password, data.password), {
				message: '账户密码错误'
			})
			return await divineCreateJwtToken({
				expire: Number(this.configService.get('jwt.expire') ?? 7200),
				secret: this.configService.get('jwt.secret'),
				data: {
					keyId: data.keyId,
					uid: data.uid,
					nickname: data.nickname,
					password: data.password,
					status: data.status
				}
			}).then(async ({ token, expire }) => {
				return await divineResult({ token, expire, message: '登录成功' })
			})
		})
	}

	/**获取用户信息**/
	public async httpResolverCustomer(state: http.ResolverCustomer) {
		return await this.validator(this.tableCustomer, {
			message: '账户不存在',
			join: { alias: 'tb' },
			where: new Brackets(qb => {
				qb.where('tb.uid = :uid', { uid: state.uid })
				qb.andWhere('tb.status IN(:...status)', { status: ['enable', 'disable'] })
			})
		}).then(async data => {
			await divineCatchWherer(data.status === 'disable', {
				message: '账户已被禁用'
			})
			return await divineResult(data)
		})
	}
}
