import { Entity, Column } from 'typeorm'
import { Common } from '@/entity/tb-common'
import { UUIDTransformer } from '@/utils/utils-entity'

@Entity('tb-mailer__record')
export class tbMailerRecord extends Common {
	@Column({ type: 'int', default: null, comment: '任务ID', readonly: true })
	jobId: number

	@Column({ comment: '任务名称', nullable: false })
	jobName: string

	@Column({ comment: '发送类型: 模板发送-sample、自定义发送-customize', nullable: false })
	type: string

	@Column({ comment: `状态: 发送完成-fulfilled、发送失败-rejected`, nullable: false })
	status: string

	@Column({ type: 'bigint', comment: 'App ID', readonly: true, transformer: UUIDTransformer })
	appId: number

	@Column({ comment: '应用名称', nullable: false })
	appName: string

	@Column({ comment: '模板ID', nullable: true })
	sampleId: number

	@Column({ comment: '模板名称', nullable: true })
	sampleName: number

	@Column({ comment: '模板封面', nullable: true })
	sampleCover: string

	@Column({ comment: '模板内容', nullable: true })
	sampleContent: string

	@Column({ type: 'text', comment: '自定义发送内容', nullable: true })
	content: string

	@Column({ type: 'bigint', comment: '用户UID', transformer: UUIDTransformer })
	uid: number

	@Column({ comment: '用户昵称', nullable: false })
	nickname: string

	@Column({ comment: '头像', nullable: true })
	avatar: string
}
