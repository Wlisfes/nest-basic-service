import { Entity, Column, ManyToOne, OneToMany } from 'typeorm'
import { isEmpty } from 'class-validator'
import { Common } from '@/entity/tb-common'
import { User } from '@/entity/tb-user.entity'

@Entity('tb-captcha__application')
export class CaptchaApplication extends Common {
	@Column({
		type: 'bigint',
		comment: 'App ID',
		readonly: true,
		transformer: { from: value => Number(value), to: value => value }
	})
	appId: number

	@Column({ comment: '应用名称', nullable: false })
	name: string

	@Column({ comment: '应用key', nullable: false })
	iv: string

	@Column({ comment: '应用密钥', nullable: false })
	appSecret: string

	@Column({ comment: '状态: activated-已激活、已禁用-disable、已删除-delete', default: 'activated', nullable: false })
	status: string

	@Column({ comment: '备注', nullable: true })
	comment: string

	@Column({ comment: '默认展示首页', nullable: false, default: 'hide' })
	visible: string

	@Column({
		type: 'varchar',
		length: 2000,
		comment: '授权地址',
		nullable: true,
		transformer: {
			from: value => (isEmpty(value) ? null : value.toString().split(',')),
			to: value => (isEmpty(value) ? [] : value.toString().join(','))
		}
	})
	bucket: string[]

	@Column({
		type: 'varchar',
		length: 2000,
		comment: '授权IP',
		nullable: true,
		transformer: {
			from: value => (isEmpty(value) ? null : value.toString().split(',')),
			to: value => (isEmpty(value) ? [] : value.toString().join(','))
		}
	})
	ip: string[]

	@ManyToOne(type => User, user => user.captcha)
	user: User

	@OneToMany(type => CaptchaRecord, record => record.app)
	record: CaptchaRecord[]
}

@Entity('tb-captcha__record')
export class CaptchaRecord extends Common {
	@Column({ type: 'varchar', comment: 'session记录', readonly: true })
	session: string

	@Column({ type: 'int', default: null, comment: '任务ID', readonly: true })
	jobId: number

	@Column({ type: 'int', nullable: false, comment: '图形宽度', readonly: true })
	width: number

	@Column({ type: 'int', nullable: false, comment: '图形高度', readonly: true })
	height: number

	@Column({ type: 'int', nullable: false, comment: '偏移量', readonly: true })
	offset: number

	@Column({ type: 'int', nullable: false, comment: 'X轴位置', readonly: true })
	pinX: number

	@Column({ type: 'int', nullable: false, comment: 'Y轴位置', readonly: true })
	pinY: number

	@Column({ type: 'varchar', length: 2000, comment: '校验凭证', nullable: true })
	token: string

	@Column({ type: 'varchar', length: 2000, comment: '来源域名' })
	referer: string

	@Column({
		comment: '校验状态: NODE：未验证、SUCCESS：验证成功、FAILURE：验证失败、INVALID：失效',
		default: 'NODE',
		nullable: false
	})
	check: string

	@ManyToOne(type => User)
	user: User

	@ManyToOne(type => CaptchaApplication, app => app.record)
	app: CaptchaApplication
}
