import { Injectable } from '@nestjs/common'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import * as http from '../interface/package.interface'

@Injectable()
export class PackageService extends CoreService {
	constructor(private readonly entity: EntityService) {
		super()
	}

	/**创建邮件套餐包**/
	public async httpCreateMailerPackage(props: http.CreateMailer) {
		return await this.RunCatch(async i18n => {
			const node = await this.entity.mailerPackage.create({
				name: props.name,
				comment: props.comment ?? null,
				expire: props.expire,
				total: props.total,
				stock: props.stock,
				surplus: props.surplus,
				maxBuy: props.maxBuy,
				price: props.price,
				discount: props.discount,
				label: props.label ?? null,
				status: 'pending'
			})
			return await this.entity.mailerPackage.save(node).then(async () => {
				return { message: i18n.t('http.CREATE_SUCCESS') }
			})
		})
	}

	/**邮件套餐包列表**/
	public async httpColumnMailerPackage(props: http.ColumnMailer) {
		return await this.RunCatch(async i18n => {
			return await this.batchValidator({
				model: this.entity.mailerPackage,
				options: {
					join: { alias: 'tb' },
					order: { createTime: 'DESC' },
					skip: (props.page - 1) * props.size,
					take: props.size
				}
			}).then(({ list, total }) => ({ list, total, page: props.page, size: props.size }))
		})
	}
}
