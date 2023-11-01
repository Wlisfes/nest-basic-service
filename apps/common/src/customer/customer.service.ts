import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Brackets } from 'typeorm'
import { compareSync } from 'bcryptjs'
import { CustomService } from '@/module/configer/custom.service'
import { TableCustomer } from '@/entity/tb-common.customer'
import { divineIntNumber, divineResult } from '@/utils/utils-common'
import { divineCatchWherer, divineCreateJwtToken } from '@/utils/utils-plugin'
import * as http from '@common/interface/customer.resolver'

@Injectable()
export class CustomerService extends CustomService {
	constructor(
		private readonly configService: ConfigService,
		@InjectRepository(TableCustomer) public readonly tableCustomer: Repository<TableCustomer>
	) {
		super()
	}

	/**注册用户**/
	public async httpRegisterCustomer(state: http.RegisterCustomer) {
		const node = await this.tableCustomer.create({
			uid: await divineIntNumber(18),
			nickname: '妖雨纯',
			password: 'MTIzNDU2',
			mobile: '18676361342'
		})
		return await this.tableCustomer.save(node)
	}

	/**登录**/
	public async httpAuthorizeCustomer(state: http.AuthorizeCustomer) {
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
