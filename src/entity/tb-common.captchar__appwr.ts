import { Entity, Column, ManyToOne } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsArray, IsString } from 'class-validator'
import { TableCommon } from '@/entity/tb-common'
import { TableCustomer } from '@/entity/tb-common.customer'
import { IsOptional } from '@/decorator/common.decorator'

@Entity('tb-common_captchar__appwr')
export class TableCaptcharAppwr extends TableCommon {
	@ApiProperty({ description: 'App ID', example: `169851019895347735` })
	@IsNotEmpty({ message: 'App ID 必填' })
	@Column({ comment: 'App ID', update: false, nullable: false })
	appId: string

	@ApiProperty({ description: '应用名称', example: '猪头' })
	@IsNotEmpty({ message: '应用名称 必填' })
	@Column({ comment: '应用名称', nullable: false })
	name: string

	@ApiProperty({ description: '应用密钥', example: 'zzFznmt8DY64hHBnkoboTmUzFZIadSdVPL4rHr8CsStfwtvBPcAICO6KgNcPEXyD' })
	@IsNotEmpty({ message: '应用密钥 必填' })
	@Column({ comment: '应用密钥', nullable: false })
	appSecret: string

	@ApiProperty({
		description: '状态: activated-已激活、已禁用-disable、已删除-delete',
		enum: ['activated', 'disable', 'delete'],
		example: 'activated'
	})
	@IsNotEmpty({ message: '状态 必填' })
	@Column({ comment: '状态: activated-已激活、已禁用-disable、已删除-delete', default: 'activated', nullable: false })
	status: string

	@ApiProperty({ description: '备注' })
	@IsOptional()
	@Column({ comment: '备注', nullable: true })
	comment: string

	@ApiProperty({ description: '默认展示首页' })
	@IsOptional()
	@Column({ comment: '默认展示首页', nullable: false, default: 'hide' })
	visible: string

	@ApiProperty({ description: '授权地址' })
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	@Column({ type: 'varchar', length: 2000, comment: '授权地址', nullable: true })
	bucket: string[]

	@ApiProperty({ description: '授权IP', required: false })
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	@Column({ type: 'varchar', length: 2000, comment: '授权IP', nullable: true })
	ip: string[]

	@ManyToOne(type => TableCustomer, customer => customer.captchar)
	customer: TableCustomer
}
