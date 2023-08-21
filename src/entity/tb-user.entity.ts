import { Entity, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm'
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

@Entity('tb-user__consumer')
export class tbUserConsumer extends Common {
	@Column({
		type: 'bigint',
		comment: 'Order ID',
		readonly: true,
		transformer: { from: value => Number(value), to: value => value }
	})
	orderId: number

	@Column({ comment: '套餐名称', nullable: false })
	packageName: string

	@Column({ comment: '原套餐包ID', nullable: false })
	packageId: number

	@Column({
		comment: `状态: 有效-effect、退款-refund、禁用-disable`,
		default: 'effect',
		nullable: false
	})
	status: string

	@Column({
		type: 'bigint',
		comment: '扣除金额',
		unsigned: true,
		nullable: false,
		default: 0,
		transformer: {
			from: value => Number(value ?? 0),
			to: value => value
		}
	})
	deduct: number

	@OneToOne(type => User)
	@JoinColumn()
	user: User
}
