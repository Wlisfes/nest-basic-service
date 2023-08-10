import { Entity, Column, ManyToOne, OneToMany } from 'typeorm'
import { Common } from '@/entity/tb-common'
import { User } from '@/entity/tb-user.entity'

@Entity('tb-mailer__application')
export class MailerApplication extends Common {
	@Column({ type: 'bigint', comment: 'uid', readonly: true })
	uid: number

	@Column({ comment: '应用名称', nullable: false })
	name: string

	@Column({ comment: '应用key', nullable: false })
	appKey: string

	@Column({ comment: '应用密钥', nullable: false })
	appSecret: string

	@Column({ comment: '状态: 禁用-disable、启用-enable', default: 'enable', nullable: false })
	status: string

	@Column({ charset: 'utf8mb4', comment: '备注', nullable: true })
	comment: string | null

	@Column({
		type: 'varchar',
		length: 2000,
		comment: '授权地址',
		nullable: true,
		transformer: { from: value => (value ?? '').split(','), to: value => (value ?? []).join(',') }
	})
	bucket: string[]

	@Column({
		type: 'varchar',
		length: 2000,
		comment: '授权IP',
		nullable: true,
		transformer: { from: value => (value ?? '').split(','), to: value => (value ?? []).join(',') }
	})
	ip: string[]

	@OneToMany(type => MailerService, app => app.app)
	service: MailerService[]

	@ManyToOne(type => User, user => user.mailer)
	user: User
}

@Entity('tb-mailer__service')
export class MailerService extends Common {
	@Column({ comment: '服务地址', nullable: false })
	host: string

	@Column({ comment: '服务端口', nullable: false })
	port: number

	@Column({ comment: '是否开启TLS', default: true })
	secure: boolean

	@Column({ comment: '登录用户', nullable: false })
	username: string

	@Column({ comment: '登录用户密码', nullable: false })
	password: string

	@Column({ comment: '优先级', nullable: false, default: 1 })
	priority: number

	@Column({ comment: '状态: 禁用-disable、启用-enable', default: 'enable', nullable: false })
	status: string

	@ManyToOne(type => MailerApplication, type => type.service)
	app: MailerApplication

	@ManyToOne(type => User)
	user: User
}
