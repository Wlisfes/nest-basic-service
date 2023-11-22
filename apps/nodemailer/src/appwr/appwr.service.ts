import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Brackets } from 'typeorm'
import { CustomService } from '@/service/custom.service'
import { DataBaseService } from '@/service/database.service'
import { divineIntNumber, divineIntStringer, divineResult } from '@/utils/utils-common'
import { TableCustomer } from '@/entity/tb-common.customer'
import { TableNodemailerAppwr } from '@/entity/tb-common.nodemailer__appwr'
import * as http from '@nodemailer/interface/appwr.resolver'

@Injectable()
export class AppwrService extends CustomService {
	constructor(private readonly dataBase: DataBaseService) {
		super()
	}

	/**创建应用**/
	public async httpCreateAppwr(state: http.CreateAppwr, uid: string) {
		return await this.validator(this.dataBase.tableCustomer, {
			message: '账户不存在',
			join: { alias: 'tb' },
			where: new Brackets(qb => {
				qb.where('tb.uid = :uid', { uid })
				qb.andWhere('tb.status IN(:...status)', { status: ['enable', 'disable'] })
			})
		}).then(async customer => {
			await this.customeCreate(this.dataBase.tableNodemailerAppwr, {
				uid,
				name: state.name,
				status: 'inactivated',
				appId: await divineIntNumber(18),
				appSecret: await divineIntStringer(32)
			})
			return await divineResult({ message: '创建成功' })
		})
	}

	/**应用列表**/
	public async httpColumnAppwr(state: http.ColumnAppwr, uid: string) {
		return await this.customeAndCountr(this.dataBase.tableNodemailerAppwr, {
			join: { alias: 'tb' },
			// where: new Brackets(qb => {
			// 	qb.where('customer.uid = :uid', { uid })
			// }),
			order: { createTime: 'DESC' },
			skip: (state.page - 1) * state.size,
			take: state.size
		}).then(async ({ list, total }) => {
			return await divineResult({ total, list })
		})
	}
}
