import { Entity, Column } from 'typeorm'
import { Common } from '@/entity/tb-common'
import { UUIDTransformer } from '@/utils/utils-entity'

@Entity('tb-captcha__record')
export class tbCaptchaRecord extends Common {
	@Column({ type: 'bigint', comment: 'App ID', readonly: true, transformer: UUIDTransformer })
	appId: number

	@Column({ comment: '应用名称', nullable: false })
	name: string

	@Column({ type: 'bigint', comment: 'User ID', readonly: true, transformer: UUIDTransformer })
	userId: number

	@Column({ charset: 'utf8mb4', comment: '昵称', nullable: false })
	nickname: string

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
}