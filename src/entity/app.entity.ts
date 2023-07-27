import { Entity, Column, ManyToOne, OneToMany } from 'typeorm'
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

	@Column({
		type: 'varchar',
		length: 2000,
		comment: '授权地址',
		default: null,
		nullable: true,
		transformer: {
			from: value => (value ?? '').split(','),
			to: value => (value ?? []).join(',')
		}
	})
	bucket: string[]

	@ManyToOne(type => UserEntity, user => user.app)
	user: UserEntity

	@OneToMany(type => RecordEntity, record => record.app)
	record: RecordEntity[]
}
