import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm'
import { Common } from '@/entity/tb-common'
import { User } from '@/entity/tb-user.entity'
import { tbMailerApplication } from '@/entity/tb-mailer__application.entity'
import { tbMailerTemplate } from '@/entity/tb-mailer__template.entity'
import { StrArraytransformer } from '@/utils/utils-entity'
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

	@Column({ comment: '接收类型: 接收列表文件-excel、自定义接收-customize', nullable: false })
	accept: string

	@Column({ comment: '发送总数', nullable: false, default: 0 })
	total: number

	@Column({ comment: '队列提交数', nullable: false, default: 0 })
	submit: number

	@Column({ comment: '成功数', nullable: true, default: 0 })
	success: number

	@Column({ comment: '失败数', nullable: true, default: 0 })
	failure: number

	@Column({ comment: '发送进度', nullable: true, default: 0 })
	progress: number

	@Column({ type: 'text', comment: '发送内容', nullable: true })
	content: string

	@Column({ comment: '发送文件ID', nullable: true })
	fileId: string

	@Column({ comment: '发送文件原始名称', nullable: true })
	fieldName: string

	@Column({ type: 'varchar', length: 5000, comment: '自定义接收列表', nullable: true, transformer: StrArraytransformer })
	receive: string[]

	@Column({
		type: 'timestamp',
		comment: '定时发送时间',
		nullable: true,
		default: null,
		transformer: { from: value => day(value).format('YYYY-MM-DD HH:mm:ss'), to: value => value }
	})
	sendTime: Date

	@Column({
		comment: `状态: 等待发送-pending、发送中-loading、发送完成-fulfilled、发送失败-rejected、手动关闭-closurer、系统关闭-automatic`,
		default: 'pending',
		nullable: false
	})
	status: string

	@ManyToOne(type => tbMailerTemplate)
	sample: tbMailerTemplate

	@ManyToOne(type => tbMailerApplication)
	app: tbMailerApplication

	@ManyToOne(type => User)
	user: User
}
