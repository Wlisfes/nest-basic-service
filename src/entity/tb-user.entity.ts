import { Entity, Column, OneToMany } from 'typeorm'
import { Common } from '@/entity/tb-common'
import { CaptchaApplication } from '@/entity/tb-captcha.entity'
import { hashSync } from 'bcryptjs'

@Entity('tb-user')
export class User extends Common {
	@Column({ type: 'bigint', comment: 'uid', readonly: true })
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
		comment: '密码',
		select: false,
		nullable: true,
		transformer: { from: value => value, to: value => (value ? hashSync(value) : null) }
	})
	password: string

	@OneToMany(type => CaptchaApplication, app => app.user)
	captcha: CaptchaApplication[]
}
