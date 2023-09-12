import { Entity, Column, ManyToOne } from 'typeorm'
import { Common } from '@/entity/tb-common'
import { User } from '@/entity/tb-user.entity'

@Entity('tb-mailer__template')
export class tbMailerTemplate extends Common {
	@Column({ comment: '模板名称', nullable: false })
	name: string

	@Column({ comment: '模板宽度', nullable: false, default: 640 })
	width: number

	@Column({
		comment: '状态: 待审核-pending、审核中-loading、已审核-review、未通过-rejected、禁用-disable、删除-delete',
		default: 'pending',
		nullable: false
	})
	status: string

	@Column({ type: 'simple-json', comment: '模板内容-JSON', nullable: false, default: null })
	json: Object

	@Column({ type: 'text', comment: '模板内容-MJML', nullable: false })
	mjml: string

	@ManyToOne(type => User)
	user: User
}
