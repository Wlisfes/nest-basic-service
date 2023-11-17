import { Injectable, Inject } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Brackets } from 'typeorm'
import { CustomService } from '@/service/custom.service'
import { TableCustomer } from '@/entity/tb-common.customer'
import { TableCaptcharAppwr } from '@/entity/tb-common.captchar__appwr'
import { divineIntNumber, divineIntStringer, divineResult, divineWherer } from '@/utils/utils-common'
import { divineClientSender } from '@/utils/utils-plugin'
import { custom } from '@/utils/utils-configer'
import * as http from '@captchar/interface/appwr.resolver'

@Injectable()
export class AppwrService extends CustomService {
	constructor(
		@Inject(custom.common.instance.name) private common: ClientProxy,
		@InjectRepository(TableCustomer) public readonly tableCustomer: Repository<TableCustomer>,
		@InjectRepository(TableCaptcharAppwr) public readonly tableCaptcharAppwr: Repository<TableCaptcharAppwr>
	) {
		super()
	}

	/**创建应用**/
	public async httpCreateCaptcharAppwr(state: http.CreateCaptcharAppwr, uid: string) {
		const user = await divineClientSender(this.common, {
			cmd: custom.common.instance.cmd.httpCheckCustomer,
			data: { uid, command: ['enable', 'disable'] }
		})
		console.log(user)
		return await this.validator(this.tableCustomer, {
			message: '账户不存在',
			join: { alias: 'tb' },
			where: new Brackets(qb => {
				qb.where('tb.uid = :uid', { uid })
				qb.andWhere('tb.status IN(:...status)', { status: ['enable', 'disable'] })
			})
		}).then(async data => {
			await this.customeCreate(this.tableCaptcharAppwr, {
				name: state.name,
				visible: 'hide',
				status: 'activated',
				appId: await divineIntNumber(18),
				appSecret: await divineIntStringer(32),
				customer: data
			})
			return await divineResult({ message: '创建成功' })
		})
	}

	/**编辑应用**/
	public async httpUpdateAppwr(state: http.UpdateAppwr, uid: string) {}

	/**应用列表**/
	public async httpColumnAppwr(state: http.ColumnAppwr, uid: string) {
		return await this.customeAndCountr(this.tableCaptcharAppwr, {
			join: {
				alias: 'tb',
				leftJoinAndSelect: { customer: 'tb.customer' }
			},
			where: new Brackets(qb => {
				qb.where('customer.uid = :uid', { uid })
			}),
			order: { createTime: 'DESC' },
			skip: (state.page - 1) * state.size,
			take: state.size
		}).then(async ({ list, total }) => {
			return await divineResult({ total, list })
		})
	}
}
