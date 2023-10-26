import { Entity, Column, OneToMany } from 'typeorm'
import { Common } from '@/entity/tb-common'
import { tbCaptchaApplication } from '@/entity/tb-captcha__application.entity'
import { tbMailerApplication } from '@/entity/tb-mailer__application.entity'
import { hashSync } from 'bcryptjs'
import { UUIDTransformer } from '@/utils/utils-entity'

@Entity('tb-user')
export class User extends Common {
	@Column({ type: 'bigint', comment: 'uid', readonly: true, transformer: UUIDTransformer })
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

	@Column({ comment: '手机号', transformer: UUIDTransformer })
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

	@OneToMany(type => tbCaptchaApplication, app => app.user)
	captcha: tbCaptchaApplication[]

	@OneToMany(type => tbMailerApplication, app => app.user)
	mailer: tbMailerApplication[]
}

@Entity('tb-user__configur')
export class tbUserConfigur extends Common {
	@Column({
		type: 'bigint',
		comment: '用户UID',
		readonly: true,
		transformer: { from: value => Number(value), to: value => value }
	})
	userId: number

	@Column({
		comment: '套餐名称：未认证-initialize、认证中-processer、认证成功-success、认证失败-failure',
		nullable: false,
		default: 'initialize'
	})
	authorize: string

	@Column({
		type: 'bigint',
		comment: '信用额度',
		unsigned: true,
		nullable: false,
		default: 0,
		transformer: { from: value => Number(value ?? 0), to: value => value }
	})
	credit: number

	@Column({
		type: 'bigint',
		comment: '当前账号信用额度',
		unsigned: true,
		nullable: false,
		default: 0,
		transformer: { from: value => Number(value ?? 0), to: value => value }
	})
	current: number

	@Column({
		type: 'bigint',
		comment: '余额',
		unsigned: false,
		nullable: false,
		default: 0,
		transformer: { from: value => Number(value ?? 0), to: value => value }
	})
	balance: number
}

@Entity('tb-user__consumer')
export class tbUserConsumer extends Common {
	@Column({
		type: 'bigint',
		comment: '用户UID',
		readonly: true,
		transformer: { from: value => Number(value), to: value => value }
	})
	userId: number

	@Column({
		type: 'bigint',
		comment: 'Order ID',
		nullable: true,
		transformer: { from: value => Number(value), to: value => value }
	})
	orderId: number

	@Column({
		type: 'bigint',
		comment: '原套餐包ID',
		readonly: true,
		transformer: { from: value => Number(value), to: value => value }
	})
	bundle: number

	@Column({ comment: '扣费类型：message-短信、email-邮件、人机验证-captcha', nullable: false })
	type: string

	@Column({ comment: '套餐名称', nullable: false })
	name: string

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
}
