import { Entity, Column, ManyToOne, OneToMany, OneToOne, JoinColumn } from 'typeorm'
import { Common } from '@/entity/tb-common'
import { User } from '@/entity/tb-user.entity'
import * as day from 'dayjs'

@Entity('tb-mailer__application')
export class MailerApplication extends Common {
	@Column({
		type: 'bigint',
		comment: 'uid',
		readonly: true,
		transformer: { from: value => Number(value), to: value => value }
	})
	uid: number

	@Column({ comment: '应用名称', nullable: false })
	name: string

	@Column({ comment: '应用key', nullable: false })
	appKey: string

	@Column({ comment: '应用密钥', nullable: false })
	appSecret: string

	@Column({
		comment: '状态: inactivated-未激活、activated-已激活、已禁用-disable、已删除-delete',
		default: 'inactivated',
		nullable: false
	})
	status: string

	@Column({ comment: '备注', nullable: true })
	comment: string

	@Column({
		type: 'varchar',
		length: 2000,
		comment: '授权地址',
		nullable: true,
		transformer: {
			from: value => (value ? (value ?? '').split(',') : []),
			to: value => (value ?? []).join(',')
		}
	})
	bucket: string[]

	@Column({
		type: 'varchar',
		length: 2000,
		comment: '授权IP',
		nullable: true,
		transformer: {
			from: value => (value ? (value ?? '').split(',') : []),
			to: value => (value ?? []).join(',')
		}
	})
	ip: string[]

	@OneToOne(type => MailerService, app => app.app)
	@JoinColumn()
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

	@Column({ comment: '服务类型', nullable: false, default: 'QQ' })
	type: string

	@ManyToOne(type => User)
	user: User

	@OneToOne(type => MailerApplication, type => type.service)
	app: MailerApplication
}

@Entity('tb-mailer__template')
export class MailerTemplate extends Common {
	@Column({ comment: '模板名称', nullable: false })
	name: string

	@Column({
		comment: '状态: 待审核-pending、审核中-loading、已审核-review、未通过-rejected、禁用-disable、删除-delete',
		default: 'pending',
		nullable: false
	})
	status: string

	@Column({ type: 'text', comment: '模板内容', nullable: false })
	content: string

	@ManyToOne(type => User)
	user: User
}

@Entity('tb-mailer__task')
export class MailerTask extends Common {
	@Column({ type: 'int', default: null, comment: '任务ID', readonly: true })
	jobId: number

	@Column({ comment: '任务名称', nullable: false })
	name: string

	@Column({ comment: '任务类型: 定时任务-schedule、即时任务-immediate', nullable: false })
	type: string

	@Column({ comment: '发送类型: 模板发送-sample、自定义发送-customize', nullable: false })
	supply: string

	@Column({ comment: '发送总数', nullable: false, default: 0 })
	total: number

	@Column({ comment: '成功数', nullable: true, default: 0 })
	success: number

	@Column({ comment: '失败数', nullable: true, default: 0 })
	failure: number

	@Column({ type: 'text', comment: '发送内容', nullable: false })
	content: string

	@Column({
		type: 'timestamp',
		comment: '定时发送时间',
		nullable: true,
		default: null,
		transformer: {
			from: value => (value ? day(value).format('YYYY-MM-DD HH:mm:ss') : null),
			to: value => (value ? new Date(value).getTime() : null)
		}
	})
	sendTime: Date

	@Column({
		comment: `状态: 等待发送-pending、发送中-loading、发送完成-fulfilled、发送失败-rejected、手动关闭-initiative、系统关闭-automatic`,
		default: 'pending',
		nullable: false
	})
	status: string

	@ManyToOne(type => MailerApplication)
	app: MailerApplication

	@ManyToOne(type => MailerTemplate)
	sample: MailerTemplate

	@ManyToOne(type => User)
	user: User
}

@Entity('tb-mailer__record')
export class MailerRecord extends Common {
	@Column({ type: 'int', default: null, comment: '任务ID', readonly: true })
	jobId: number

	@Column({ comment: '任务名称', nullable: false })
	name: string

	@Column({ comment: '任务类型: 定时任务-schedule、即时任务-immediate', nullable: false })
	type: string

	@Column({ comment: '发送类型: 模板发送-sample、自定义发送-customize', nullable: false })
	supply: string

	@Column({ type: 'text', comment: '发送内容', nullable: false })
	content: string

	@Column({
		comment: `状态: 发送完成-fulfilled、发送失败-rejected`,
		nullable: false
	})
	status: string

	@ManyToOne(type => MailerApplication)
	app: MailerApplication

	@ManyToOne(type => MailerTemplate)
	sample: MailerTemplate

	@ManyToOne(type => User)
	user: User
}
