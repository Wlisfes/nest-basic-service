import { Entity, Column, ManyToOne } from 'typeorm'
import { isEmpty } from 'class-validator'
import { Common } from '@/entity/tb-common'
import { UUIDTransformer, StrArraytransformer } from '@/utils/utils-entity'
import { User } from '@/entity/tb-user.entity'

@Entity('tb-captcha__application')
export class tbCaptchaApplication extends Common {
	@Column({ type: 'bigint', comment: 'App ID', readonly: true, transformer: UUIDTransformer })
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

	@Column({ type: 'varchar', length: 2000, comment: '授权地址', nullable: true, transformer: StrArraytransformer })
	bucket: string[]

	@Column({ type: 'varchar', length: 2000, comment: '授权IP', nullable: true, transformer: StrArraytransformer })
	ip: string[]

	@ManyToOne(type => User, user => user.captcha)
	user: User
}
