import { ApiProperty, PickType, IntersectionType, PartialType } from '@nestjs/swagger'
import { IsNotEmpty, Length, IsNumber, IsString, IsArray } from 'class-validator'
import { Type, Transform } from 'class-transformer'
import { IsOptional, IsMobile, TransferNumber } from '@/decorator/common.decorator'
import { Request } from '@/interface/common.interface'

export class RequestApp extends PickType(Request, ['id', 'status']) {
	@ApiProperty({ description: '应用名称', example: '猪头' })
	@IsNotEmpty({ message: '应用名称 必填' })
	name: string

	@ApiProperty({ description: '应用key', example: 'sFnFysvpL0DFGs6H' })
	@IsNotEmpty({ message: '应用key 必填' })
	appKey: string

	@ApiProperty({ description: '应用密钥' })
	@IsNotEmpty({ message: '应用密钥 必填' })
	appSecret: string

	@ApiProperty({ description: '应用密钥', required: false })
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	bucket: string[]
}

/**创建应用**/
export class RequestCreateApp extends PickType(RequestApp, ['name']) {}

/**编辑授权地址**/
export class RequestUpdateBucket extends PickType(RequestApp, ['bucket', 'appKey']) {}

/**应用信息**/
export class RequestBasicApp extends PickType(RequestApp, ['appKey']) {}
