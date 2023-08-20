import { Entity, Column } from 'typeorm'
import { Common } from '@/entity/tb-common'

@Entity('tb-mailer__package')
export class tbMailerPackage extends Common {
	@Column({ comment: '套餐名称', nullable: false })
	name: string

	@Column({ comment: '套餐备注', nullable: true })
	comment: string

	@Column({ comment: '套餐有效期：单位为月份', nullable: true })
	expire: number

	@Column({ comment: '套餐总数', unsigned: true, nullable: false, default: 0 })
	total: number

	@Column({ comment: '套餐发行数量', unsigned: true, nullable: false, default: 0 })
	stock: number

	@Column({ comment: '套餐剩余数量', nullable: false, default: 0 })
	surplus: number

	@Column({ comment: '套餐最大购买数量：0-不限制', unsigned: true, default: 0, nullable: false })
	maxBuy: number

	@Column({
		type: 'bigint',
		comment: '套餐价格',
		unsigned: true,
		nullable: false,
		default: 0,
		transformer: {
			from: value => Number(value ?? 0),
			to: value => value
		}
	})
	price: number

	@Column({
		type: 'bigint',
		comment: '套餐折扣',
		unsigned: true,
		default: 0,
		nullable: false,
		transformer: {
			from: value => Number(value ?? 0),
			to: value => value
		}
	})
	discount: number

	@Column({ comment: '套餐标签', nullable: true })
	label: string

	@Column({
		comment: `状态: 待生效-pending、已上架-upper、已下架-under、已过期-expired、已售罄-soldout、已删除-delete`,
		default: 'pending',
		nullable: false
	})
	status: string
}
