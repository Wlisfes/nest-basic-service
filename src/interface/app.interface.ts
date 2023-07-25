import { ApiProperty, PickType, IntersectionType, PartialType } from '@nestjs/swagger'
import { IsNotEmpty, Length, IsNumber } from 'class-validator'
import { Type, Transform } from 'class-transformer'
import { IsOptional, IsMobile, TransferNumber } from '@/decorator/common.decorator'
import { RequestCommon } from '@/interface/common.interface'

export class RequestApp extends PickType(RequestCommon, ['id', 'status']) {
	@ApiProperty({ description: '应用名称', example: '猪头' })
	@IsNotEmpty({ message: '应用名称 必填' })
	name: string

	@ApiProperty({ description: '应用key' })
	@IsNotEmpty({ message: '应用key 必填' })
	appKey: string

	@ApiProperty({ description: '应用密钥' })
	@IsNotEmpty({ message: '应用密钥 必填' })
	appSecret: string
}

/**创建应用**/
export class RequestCreateApp extends PickType(RequestApp, ['name']) {}
