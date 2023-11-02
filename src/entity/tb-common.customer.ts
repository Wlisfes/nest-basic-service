import { Entity, Column, OneToMany, OneToOne, JoinColumn } from 'typeorm'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Length, IsEmail } from 'class-validator'
import { hashSync } from 'bcryptjs'
import { TableCommon } from '@/entity/tb-common'
import { IsMobile, IsOptional } from '@/decorator/common.decorator'
import { TableCustomerConfigur } from '@/entity/tb-common.customer__configur'
import { TableCaptcharAppwr } from '@/entity/tb-common.captchar__appwr'

@Entity('tb-common_customer')
export class TableCustomer extends TableCommon {
	@ApiProperty({ description: '用户唯一UID', example: 1 })
	@IsNotEmpty({ message: 'UID 必填' })
	@Column({ comment: 'uid', update: false, nullable: false })
	uid: string

	@ApiProperty({ description: '用户昵称', example: '妖雨纯' })
	@IsNotEmpty({ message: '用户昵称 必填' })
	@Column({ comment: '昵称', nullable: false })
	nickname: string

	@ApiProperty({ description: '邮箱', example: 'ucop8dd096@foxmail.com' })
	@IsNotEmpty({ message: '邮箱 必填' })
	@IsEmail({}, { message: '邮箱 格式错误' })
	@Column({ comment: '邮箱', nullable: true })
	email: string

	@ApiProperty({ description: '头像' })
	@IsNotEmpty({ message: '头像 必填' })
	@Column({ comment: '头像', nullable: true, default: null })
	avatar: string

	@ApiProperty({
		description: '状态: 禁用-disable、启用-enable、删除-delete',
		enum: ['disable', 'enable', 'delete'],
		example: 'enable'
	})
	@IsNotEmpty({ message: '状态 必填' })
	@Column({ comment: '状态: 禁用-disable、启用-enable、删除-delete', default: 'enable', nullable: false })
	status: string

	@ApiProperty({ description: '备注' })
	@IsOptional()
	@Column({ comment: '备注', nullable: true })
	comment: string

	@ApiProperty({ description: '手机号', example: 18888888888 })
	@IsNotEmpty({ message: '手机号 必填' })
	@IsMobile({ message: '手机号 格式错误' })
	@Column({ comment: '手机号', nullable: false })
	mobile: string

	@ApiProperty({ description: '密码', example: 'MTIzNDU2' })
	@IsNotEmpty({ message: '密码 必填' })
	@Length(6, 18, { message: '密码格式错误' })
	@Column({
		comment: '密码',
		select: false,
		nullable: false,
		transformer: { from: value => value, to: value => hashSync(value) }
	})
	password: string

	@OneToOne(type => TableCustomerConfigur, configur => configur.customer)
	@JoinColumn({ name: 'configurId' })
	configur: TableCustomerConfigur

	@OneToMany(type => TableCaptcharAppwr, app => app.customer)
	captchar: TableCaptcharAppwr[]

	// @OneToMany(type => tbMailerApplication, app => app.user)
	// mailer: tbMailerApplication[]
}
