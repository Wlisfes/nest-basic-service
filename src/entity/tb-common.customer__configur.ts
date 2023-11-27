import { Entity, Column } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { TableCommon } from '@/entity/tb-common'

@Entity('tb-common_customer__configur')
export class TableCustomerConfigur extends TableCommon {
	@ApiProperty({ description: '用户唯一UID', example: 1 })
	@IsNotEmpty({ message: 'UID 必填' })
	@Column({ comment: 'uid', update: false, nullable: false })
	uid: string

	@ApiProperty({ description: 'API Key', example: '' })
	@IsNotEmpty({ message: 'API Key 必填' })
	@Column({ comment: 'API Key', nullable: false })
	apiKey: string

	@ApiProperty({ description: 'API Secret', example: '' })
	@IsNotEmpty({ message: 'API Secret 必填' })
	@Column({ comment: 'API Secret', nullable: false })
	apiSecret: string

	@ApiProperty({
		description: '用户认证状态：未认证-initialize、认证中-processer、认证成功-success、认证失败-failure',
		enum: ['initialize', 'processer', 'success', 'failure'],
		example: 'initialize'
	})
	@IsNotEmpty({ message: '认证状态 必填' })
	@Column({
		comment: '套餐名称：未认证-initialize、认证中-processer、认证成功-success、认证失败-failure',
		nullable: false,
		default: 'initialize'
	})
	authorize: string

	@ApiProperty({ description: '用户信用额度', example: 0 })
	@IsNotEmpty({ message: '信用额度 必填' })
	@Column({
		type: 'bigint',
		comment: '信用额度',
		unsigned: true,
		nullable: false,
		default: 0,
		transformer: { from: value => Number(value ?? 0), to: value => value }
	})
	credit: number

	@ApiProperty({ description: '用户当前信用额度', example: 0 })
	@IsNotEmpty({ message: '用户当前信用额度 必填' })
	@Column({
		type: 'bigint',
		comment: '用户当前信用额度',
		unsigned: true,
		nullable: false,
		default: 0,
		transformer: { from: value => Number(value ?? 0), to: value => value }
	})
	current: number

	@ApiProperty({ description: '用户余额', example: 0 })
	@IsNotEmpty({ message: '用户余额 必填' })
	@Column({
		type: 'bigint',
		comment: '用户余额',
		unsigned: false,
		nullable: false,
		default: 0,
		transformer: { from: value => Number(value ?? 0), to: value => value }
	})
	balance: number
}
