import { Entity, Column, ManyToOne } from 'typeorm'
import { Common } from '@/entity/tb-common'
import { User } from '@/entity/tb-user.entity'
import { tbMailerApplication } from '@/entity/tb-mailer__application.entity'
import { tbMailerTemplate } from '@/entity/tb-mailer__template.entity'

@Entity('tb-mailer__record')
export class tbMailerRecord extends Common {
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

	@ManyToOne(type => tbMailerApplication)
	app: tbMailerApplication

	@ManyToOne(type => tbMailerTemplate)
	sample: tbMailerTemplate

	@ManyToOne(type => User)
	user: User
}
