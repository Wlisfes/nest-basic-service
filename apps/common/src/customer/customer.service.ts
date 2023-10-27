import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TableCustomer } from '@/entity/tb-common.customer'
import { divineIntNumber } from '@/utils/utils-common'
import { faker } from '@/utils/utils-plugin'

@Injectable()
export class CustomerService {
	constructor(@InjectRepository(TableCustomer) public readonly tableCustomer: Repository<TableCustomer>) {}

	/**注册用户**/
	public async httpRegister() {
		const node = await this.tableCustomer.create({
			uid: await divineIntNumber(),
			nickname: faker.person.fullName(),
			password: 'MTIzNDU2'
		})
		return await this.tableCustomer.save(node)
	}
}
