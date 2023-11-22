import { Entity, Column, ManyToOne } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsArray, IsString, IsBoolean } from 'class-validator'
import { TableCommon } from '@/entity/tb-common'
import { IsOptional } from '@/decorator/common.decorator'

@Entity('tb-common_nodemailer__appwr')
export class TableNodemailerAppwr extends TableCommon {
	@ApiProperty({ description: 'App ID', example: `169851019895347735` })
	@IsNotEmpty({ message: 'App ID 必填' })
	@Column({ comment: 'App ID', update: false, nullable: false })
	appId: string

	@ApiProperty({ description: '应用名称', example: '猪头' })
	@IsNotEmpty({ message: '应用名称 必填' })
	@Column({ comment: '应用名称', nullable: false })
	name: string

	@ApiProperty({ description: '应用密钥', example: 'PL4rHr8CsStfwtvBPcAICO6KgNcPEXyD' })
	@IsNotEmpty({ message: '应用密钥 必填' })
	@Column({ comment: '应用密钥', nullable: false })
	appSecret: string

	@ApiProperty({
		description: '状态: inactivated-未激活、activated-已激活、已禁用-disable、已删除-delete',
		enum: ['inactivated', 'activated', 'disable', 'delete'],
		example: 'inactivated'
	})
	@IsNotEmpty({ message: '状态 必填' })
	@Column({
		comment: '状态: inactivated-未激活、activated-已激活、已禁用-disable、已删除-delete',
		default: 'inactivated',
		nullable: false
	})
	status: string

	@ApiProperty({ description: '备注', required: false })
	@IsOptional()
	@Column({ comment: '备注', nullable: true })
	comment: string

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

	@ApiProperty({ description: '服务地址', required: false })
	@IsNotEmpty({ message: '服务地址 必填' })
	@Column({ comment: '服务地址', nullable: true })
	host: string

	@ApiProperty({ description: '服务端口', required: false })
	@IsNotEmpty({ message: '服务端口 必填' })
	@Column({ comment: '服务端口', nullable: true })
	port: number

	@ApiProperty({ description: '是否开启TLS', required: false })
	@IsNotEmpty({ message: '是否开启TLS 必填' })
	@Column({ comment: '是否开启TLS', nullable: true })
	secure: boolean

	@ApiProperty({ description: '登录用户', required: false })
	@IsNotEmpty({ message: '登录用户 必填' })
	@Column({ comment: '登录用户', nullable: true })
	username: string

	@ApiProperty({ description: '登录用户密码', required: false })
	@IsNotEmpty({ message: '登录用户密码 必填' })
	@Column({ comment: '登录用户密码', nullable: true })
	password: string

	@ApiProperty({
		description: '服务类型',
		enum: ['QQ', 'Gmail'],
		required: false
	})
	@IsNotEmpty({ message: '服务类型 必填' })
	@Column({ comment: '服务类型', nullable: true })
	type: string
}
