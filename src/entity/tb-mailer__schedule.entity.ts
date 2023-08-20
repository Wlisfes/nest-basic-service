import { Entity, Column, ManyToOne } from 'typeorm'
import { Common } from '@/entity/tb-common'
import { User } from '@/entity/tb-user.entity'
import { tbMailerApplication } from '@/entity/tb-mailer__application.entity'
import * as day from 'dayjs'

@Entity('tb-mailer__schedule')
export class tbMailerSchedule extends Common {
	@Column({ type: 'int', comment: '任务ID', nullable: true })
	jobId: number

	@Column({ comment: '任务名称', nullable: false })
	name: string

	@Column({ comment: '任务类型: 定时任务-schedule、即时任务-immediate', nullable: false })
	type: string

	@Column({ comment: '发送类型: 模板发送-sample、自定义发送-customize', nullable: false })
	super: string

	@Column({ comment: '发送总数', nullable: false, default: 0 })
	total: number

	@Column({ comment: '成功数', nullable: true, default: 0 })
	success: number

	@Column({ comment: '失败数', nullable: true, default: 0 })
	failure: number

	@Column({ comment: '模板ID', nullable: true })
	columnId: string

	@Column({ comment: '模板名称', nullable: true })
	columnName: string

	@Column({ type: 'text', comment: '发送内容', nullable: false })
	content: string

	@Column({
		type: 'timestamp',
		comment: '定时发送时间',
		nullable: true,
		default: null,
		transformer: {
			from: value => day(value).format('YYYY-MM-DD HH:mm:ss'),
			to: value => value
		}
	})
	sendTime: Date

	@Column({
		comment: `状态: 等待发送-pending、发送中-loading、发送完成-fulfilled、发送失败-rejected、手动关闭-initiative、系统关闭-automatic`,
		default: 'pending',
		nullable: false
	})
	status: string

	@ManyToOne(type => tbMailerApplication)
	app: tbMailerApplication

	@ManyToOne(type => User)
	user: User
}
