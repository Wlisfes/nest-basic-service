import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm'
import { Common } from '@/entity/tb-common'
import { User } from '@/entity/tb-user.entity'
import { tbMailerService } from '@/entity/tb-mailer__service.entity'

@Entity('tb-mailer__application')
export class tbMailerApplication extends Common {
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

	@OneToOne(type => tbMailerService, app => app.app)
	@JoinColumn()
	service: tbMailerService

	@ManyToOne(type => User, user => user.mailer)
	user: User
}
