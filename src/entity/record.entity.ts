import { Entity, Column, ManyToOne } from 'typeorm'
import { CommonEntity } from '@/entity/common.entity'
import { AppEntity } from '@/entity/app.entity'

@Entity('tb-record')
export class RecordEntity extends CommonEntity {
	@Column({ type: 'bigint', comment: 'uid', readonly: true })
	uid: number

	@Column({ type: 'bigint', comment: 'RequestID', readonly: true })
	requestId: number

	@Column('simple-json', { nullable: false, comment: '位置参数' })
	location: Object

	@Column({ type: 'bigint', nullable: false, comment: 'X轴位置' })
	pinX: number

	@Column({ type: 'bigint', nullable: false, comment: 'Y轴位置' })
	pinY: number

	@ManyToOne(type => AppEntity, app => app.record)
	app: AppEntity
}
