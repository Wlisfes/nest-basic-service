import { Entity, Column, ManyToOne } from 'typeorm'
import { CommonEntity } from '@/entity/common.entity'
import { AppEntity } from '@/entity/app.entity'

@Entity('tb-record')
export class RecordEntity extends CommonEntity {
	@Column({ type: 'bigint', comment: 'uid', readonly: true })
	uid: number

	@Column({ type: 'varchar', comment: 'RequestID', readonly: true })
	requestId: string

	@Column({ type: 'int', nullable: false, comment: '图形宽度' })
	width: number

	@Column({ type: 'int', nullable: false, comment: '图形高度' })
	height: number

	@Column({ type: 'int', nullable: false, comment: '偏移量' })
	offset: number

	@Column({ type: 'int', nullable: false, comment: 'X轴位置' })
	pinX: number

	@Column({ type: 'int', nullable: false, comment: 'Y轴位置' })
	pinY: number

	@ManyToOne(type => AppEntity, app => app.record)
	app: AppEntity
}
