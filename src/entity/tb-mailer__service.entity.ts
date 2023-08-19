import { Entity, Column, ManyToOne, OneToOne } from 'typeorm'
import { Common } from '@/entity/tb-common'
import { User } from '@/entity/tb-user.entity'
import { tbMailerApplication } from '@/entity/tb-mailer__application.entity'

@Entity('tb-mailer__service')
export class tbMailerService extends Common {
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

	@OneToOne(type => tbMailerApplication, type => type.service)
	app: tbMailerApplication
}
