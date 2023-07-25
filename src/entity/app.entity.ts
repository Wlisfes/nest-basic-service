import { Entity, Column, ManyToOne } from 'typeorm'
import { CommonEntity } from '@/entity/common.entity'
import { UserEntity } from '@/entity/user.entity'
import { RecordEntity } from '@/entity/record.entity'

@Entity('tb-app')
export class AppEntity extends CommonEntity {
	@Column({ type: 'bigint', comment: 'uid', readonly: true })
	uid: number

	@Column({ charset: 'utf8mb4', comment: '应用名称', nullable: false })
	name: string

	@Column({ charset: 'utf8mb4', comment: '应用key', nullable: false })
	appKey: string

	@Column({ charset: 'utf8mb4', comment: '应用密钥', nullable: false })
	appSecret: string

	@Column({ comment: '状态: 禁用-disable、启用-enable', default: 'enable', nullable: false })
	status: string

	@Column({ charset: 'utf8mb4', comment: '备注', nullable: true })
	comment: string | null

	@ManyToOne(type => UserEntity, user => user.app)
	user: UserEntity

	@ManyToOne(type => RecordEntity, record => record.app)
	record: RecordEntity[]
}
