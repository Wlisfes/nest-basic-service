import { HttpStatus, Injectable, Inject } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { Brackets } from 'typeorm'
import { compareSync } from 'bcryptjs'
import { CustomService } from '@/service/custom.service'
import { CommonCacheCustomerService } from '@/cache/common-customer.service'
import { DataBaseService } from '@/service/database.service'
import { divineIntNumber, divineResult } from '@/utils/utils-common'
import { divineCatchWherer, divineCreateJwtToken, divineClientSender } from '@/utils/utils-plugin'
import { custom } from '@/utils/utils-configer'
import * as http from '@common/interface/customer.resolver'

@Injectable()
export class CustomerService extends CustomService {
	constructor(
		private readonly cacheCustomer: CommonCacheCustomerService,
		private readonly dataBase: DataBaseService,
		@Inject(custom.captchar.instance.name) private captchar: ClientProxy
	) {
		super()
	}

	/**用户校验**/
	public async httpCheckCustomer(state: { uid: string; command: Array<string> }) {
		return await this.validator(this.dataBase.tableCustomer, {
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
		const node = await this.dataBase.tableCustomer.create({
			uid: await divineIntNumber(18),
			nickname: '宫新哲',
			password: 'MTIzNDU1',
			mobile: '18888888888'
		})
		return await this.dataBase.tableCustomer.save(node)
	}

	/**登录**/
	public async httpAuthorizeCustomer(state: http.AuthorizeCustomer, referer: string) {
		/**验证服务校验**/
		await divineClientSender(this.captchar, {
			cmd: custom.captchar.instance.cmd.httpAuthorizeCheckerPattern,
			data: {
				referer,
				appSecret: 'zzFznmt8DY64hHBnkoboTmUzFZIadSdV',
				appId: '169851019895347735',
				session: state.session,
				token: state.token
			}
		}).then(async data => {
			return await divineCatchWherer(data.check, { message: data.message })
		})

		/**查询登录用户**/
		const node = await this.validator(this.dataBase.tableCustomer, {
			message: '账户不存在',
			select: ['keyId', 'uid', 'nickname', 'avatar', 'mobile', 'email', 'password', 'status', 'createTime', 'updateTime'],
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
			return data
		})

		/**生成token**/
		return await divineCreateJwtToken({
			expire: custom.jwt.expire ?? 7200,
			secret: custom.jwt.secret,
			data: { keyId: node.keyId, uid: node.uid, nickname: node.nickname, password: node.password, status: node.status }
		}).then(async ({ token, expire }) => {
			await this.cacheCustomer.writeCustomer(node.uid, {
				keyId: node.keyId,
				uid: node.uid,
				createTime: node.createTime,
				updateTime: node.updateTime,
				nickname: node.nickname,
				email: node.email,
				avatar: node.avatar,
				status: node.status,
				mobile: node.mobile
			})
			return await divineResult({ token, expire, message: '登录成功' })
		})
	}

	/**获取用户信息**/
	public async httpResolverCustomer(state: http.ResolverCustomer) {
		return await this.validator(this.dataBase.tableCustomer, {
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
			const node = await this.cacheCustomer.readCustomer(data.uid)
			console.log(node)
			return await divineResult(data)
		})
	}
}
