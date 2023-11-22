import { Entity, Column } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { TableCommon } from '@/entity/tb-common'

@Entity('tb-common_captchar__record')
export class TableCaptcharRecord extends TableCommon {
	@ApiProperty({ description: 'App ID', example: `169851019895347735` })
	@IsNotEmpty({ message: 'App ID 必填' })
	@Column({ comment: 'App ID', update: false, nullable: false })
	appId: string

	@ApiProperty({ description: '用户唯一UID', example: 1 })
	@IsNotEmpty({ message: 'UID 必填' })
	@Column({ comment: 'uid', update: false, nullable: false })
	uid: string

	@ApiProperty({ description: 'session记录', example: '16985101989534773582638456124453' })
	@IsNotEmpty({ message: 'session记录 必填' })
	@Column({ type: 'varchar', comment: 'session记录', update: false, nullable: false })
	session: string

	@ApiProperty({ description: '校验凭证', example: 'fSgErMcPFAk3hto8v5SY...' })
	@IsNotEmpty({ message: '校验凭证 必填' })
	@Column({ type: 'varchar', length: 2000, comment: '校验凭证', update: false, nullable: false })
	token: string

	@ApiProperty({ description: '来源地址', example: '妖雨纯' })
	@IsNotEmpty({ message: '来源地址 必填' })
	@Column({ type: 'varchar', length: 2000, comment: '来源地址', nullable: true })
	referer: string

	@ApiProperty({
		description: '校验状态: node-未验证、success-验证成功、failure-验证失败、invalid-失效',
		enum: ['node', 'success', 'failure', 'invalid'],
		example: 'node'
	})
	@Column({
		comment: '校验状态: node-未验证、success-验证成功、failure-验证失败、invalid-失效',
		default: 'node',
		nullable: false
	})
	status: string
}
