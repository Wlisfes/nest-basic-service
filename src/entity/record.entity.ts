import { Entity, Column, ManyToOne } from 'typeorm'
import { CommonEntity } from '@/entity/common.entity'
import { UserEntity } from '@/entity/user.entity'
import { AppEntity } from '@/entity/app.entity'

@Entity('tb-record')
export class RecordEntity extends CommonEntity {
	@Column({ type: 'bigint', comment: 'uid', readonly: true })
	uid: number

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

	@ManyToOne(type => UserEntity)
	user: UserEntity

	@ManyToOne(type => AppEntity, app => app.record)
	app: AppEntity
}
