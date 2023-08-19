import { ApiProperty, PickType, IntersectionType } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsArray } from 'class-validator'
import { Type } from 'class-transformer'
import { IsOptional } from '@/decorator/common.decorator'
import { Request } from '@/interface/common.interface'

export class MailerService extends PickType(Request, ['id']) {
	@ApiProperty({ description: '服务地址', example: 'smtp.qq.com' })
	@IsNotEmpty({ message: '服务地址 必填' })
	host: string

	@ApiProperty({ description: '服务端口', example: 465 })
	@IsNotEmpty({ message: '服务端口 必填' })
	@Type(() => Number)
	port: number

	@ApiProperty({ description: 'TLS开管', example: true })
	@IsNotEmpty({ message: 'TLS开管 必填' })
	@Type(() => Boolean)
	secure: boolean

	@ApiProperty({ description: '登录用户' })
	@IsNotEmpty({ message: '登录用户 必填' })
	username: string

	@ApiProperty({ description: '登录用户密码' })
	@IsNotEmpty({ message: '登录用户密码 必填' })
	password: string

	@ApiProperty({ description: '服务类型', example: 'QQ' })
	@IsNotEmpty({ message: '服务类型 必填' })
	type: string
}

export class MailerApplication extends PickType(Request, ['id', 'status']) {
	@ApiProperty({ description: '应用名称', example: '猪头' })
	@IsNotEmpty({ message: '应用名称 必填' })
	name: string

	@ApiProperty({ description: '应用key', example: 'sFnFysvpL0DFGs6H' })
	@IsNotEmpty({ message: '应用key 必填' })
	appKey: string

	@ApiProperty({ description: '应用密钥' })
	@IsNotEmpty({ message: '应用密钥 必填' })
	appSecret: string

	@ApiProperty({ description: '授权地址', required: false })
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	bucket: string[]

	@ApiProperty({ description: '授权IP', required: false })
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	ip: string[]
}

/**创建应用**/
export class CreateApplication extends PickType(MailerApplication, ['name']) {}

/**编辑授权地址**/
export class UpdateBucket extends PickType(MailerApplication, ['bucket', 'ip', 'appKey']) {}

/**应用列表**/
export class ColumnApplication extends IntersectionType(PickType(Request, ['page', 'size']), PickType(MailerApplication, [])) {}

/**应用信息**/
export class BasicApplication extends PickType(MailerApplication, ['appKey']) {}

/**添加、修改应用SMTP服务**/
export class UpdateMailerService extends IntersectionType(
	PickType(MailerApplication, ['appKey']),
	PickType(MailerService, ['host', 'port', 'secure', 'type', 'username', 'password'])
) {}
