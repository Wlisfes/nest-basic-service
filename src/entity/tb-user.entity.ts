import { Entity, Column, OneToMany } from 'typeorm'
import { Common } from '@/entity/tb-common'
import { CaptchaApplication } from '@/entity/tb-captcha.entity'
import { tbMailerApplication } from '@/entity/tb-mailer__application.entity'
import { hashSync } from 'bcryptjs'

@Entity('tb-user')
export class User extends Common {
	@Column({
		type: 'bigint',
		comment: 'uid',
		readonly: true,
		transformer: { from: value => Number(value), to: value => value }
	})
	uid: number

	@Column({ charset: 'utf8mb4', comment: '昵称', nullable: false })
	nickname: string

	@Column({ comment: '邮箱', nullable: true })
	email: string | null

	@Column({ comment: '头像', nullable: true, default: null })
	avatar: string

	@Column({ comment: '状态: 禁用-disable、启用-enable、删除-delete', default: 'enable', nullable: false })
	status: string

	@Column({ charset: 'utf8mb4', comment: '备注', nullable: true })
	comment: string | null

	@Column({
		comment: '手机号',
		transformer: { from: value => Number(value), to: value => value }
	})
	mobile: string

	@Column({
		comment: '密码',
		select: false,
		nullable: false,
		transformer: {
			from: value => value,
			to: value => hashSync(value)
		}
	})
	password: string

	@OneToMany(type => CaptchaApplication, app => app.user)
	captcha: CaptchaApplication[]

	@OneToMany(type => tbMailerApplication, app => app.user)
	mailer: tbMailerApplication[]
}

// @Entity('tb-user__package')
// export class UserPackage extends Common {
// 	@Column({ comment: '订单ID', nullable: false, update: false })
// 	orderId

// 	@Column({ comment: '套餐ID', nullable: false })
// 	suiteId: number

// 	@Column({ comment: '套餐名称', nullable: false })
// 	name: string

// 	@Column({ type: 'bigint', comment: '套餐购买价格', unsigned: true, nullable: false, default: 0 })
// 	price: number

// 	@Column({ comment: '套餐总数', unsigned: true, nullable: false, default: 0 })
// 	total: number

// 	@Column({ comment: '套餐剩余数量', nullable: false, default: 0 })
// 	surplus: number

// 	@Column({
// 		comment: `状态: 未支付-pending、已支付-effect、已过期-expired、已上架-defray、已下架-under、已售罄-soldout、已删除-delete`,
// 		default: 'pending',
// 		nullable: false
// 	})
// 	status: string
// }
