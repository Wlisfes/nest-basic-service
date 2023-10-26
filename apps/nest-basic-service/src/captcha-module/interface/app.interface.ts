import { ApiProperty, PickType, IntersectionType } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsArray } from 'class-validator'
import { Type } from 'class-transformer'
import { IsOptional } from '@/decorator/common.decorator'
import { Request } from '@/interface/common.interface'

export class CaptchaApplication extends PickType(Request, ['id', 'status']) {
	@ApiProperty({ description: 'App ID', example: 1692282119673627 })
	@IsNotEmpty({ message: 'App ID 必填' })
	@Type(type => Number)
	appId: number

	@ApiProperty({ description: '应用名称', example: '猪头' })
	@IsNotEmpty({ message: '应用名称 必填' })
	name: string

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
export class CreateApplication extends PickType(CaptchaApplication, ['name']) {}

/**编辑授权地址**/
export class UpdateBucket extends PickType(CaptchaApplication, ['bucket', 'ip', 'appId']) {}

/**应用列表**/
export class ColumnApplication extends IntersectionType(PickType(Request, ['page', 'size']), PickType(CaptchaApplication, [])) {}

/**应用信息**/
export class BasicApplication extends PickType(CaptchaApplication, ['appId']) {}

/**修改应用名称**/
export class UpdateNameApplication extends PickType(CaptchaApplication, ['appId', 'name']) {}
