import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Brackets } from 'typeorm'
import { CustomService } from '@/module/configer/custom.service'
import { TableCustomer } from '@/entity/tb-common.customer'
import { divineIntNumber } from '@/utils/utils-common'
import * as resolver from '@common/interface/customer.resolver'

@Injectable()
export class CustomerService extends CustomService {
	constructor(@InjectRepository(TableCustomer) public readonly tableCustomer: Repository<TableCustomer>) {
		super()
	}

	/**注册用户**/
	public async httpRegisterCustomer(state: resolver.RegisterCustomer) {
		const node = await this.tableCustomer.create({
			uid: await divineIntNumber(),
			nickname: '妖雨纯',
			password: 'MTIzNDU2',
			mobile: '18676361342'
		})
		return await this.tableCustomer.save(node)
	}

	/**登录**/
	public async httpAuthorizeCustomer(state: resolver.AuthorizeCustomer) {
		return await this.validator(this.tableCustomer, {
			message: '用户不存在',
			join: { alias: 'tb' },
			where: new Brackets(qb => {
				qb.where('tb.mobile = :mobile', { mobile: state.mobile })
			})
		})
	}

	/**获取用户信息**/
	public async httpBearerCustomer(state: resolver.BearerCustomer) {}
}
