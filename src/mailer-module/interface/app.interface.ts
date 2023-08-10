import { ApiProperty, PickType } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsArray } from 'class-validator'
import { IsOptional } from '@/decorator/common.decorator'
import { RequestCommon } from '@/interface/common.interface'

export class MailerApplication extends PickType(RequestCommon, ['id', 'status']) {
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

/**应用信息**/
export class BasicApplication extends PickType(MailerApplication, ['appKey']) {}
