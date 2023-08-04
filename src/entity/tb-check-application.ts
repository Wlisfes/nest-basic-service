import { Entity, Column, ManyToOne, OneToMany } from 'typeorm'
import { Common } from '@/entity/tb-common'
import { User } from '@/entity/tb-user'
import { CheckRecord } from '@/entity/tb-check-record'

@Entity('tb-check-application')
export class CheckApplication extends Common {
	@Column({ type: 'bigint', comment: 'uid', readonly: true })
	uid: number

	@Column({ comment: '应用名称', nullable: false })
	name: string

	@Column({ comment: '应用key', nullable: false })
	appKey: string

	@Column({ comment: '应用密钥', nullable: false })
	appSecret: string

	@Column({ comment: '状态: 禁用-disable、启用-enable', default: 'enable', nullable: false })
	status: string

	@Column({ charset: 'utf8mb4', comment: '备注', nullable: true })
	comment: string | null

	@Column({
		type: 'varchar',
		length: 2000,
		comment: '授权地址',
		nullable: true,
		transformer: {
			from: value => (value ?? '').split(','),
			to: value => (value ?? []).join(',')
		}
	})
	bucket: string[]

	@ManyToOne(type => User, user => user.check)
	user: User

	@OneToMany(type => CheckRecord, record => record.app)
	record: CheckRecord[]
}
