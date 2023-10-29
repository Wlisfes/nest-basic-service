import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { IsOptional } from '@/decorator/common.decorator'

export class RequestResolver {
	@ApiProperty({ description: 'keyId', example: 1 })
	@IsNotEmpty({ message: 'keyId 必填' })
	keyId: number

	@ApiProperty({ description: '当前页', required: false, example: 1 })
	@IsOptional()
	@IsNumber({}, { message: 'page必须是数字' })
	@Type(type => Number)
	page: number

	@ApiProperty({ description: '分页数量', required: false, example: 10 })
	@IsOptional()
	@IsNumber({}, { message: 'size必须是数字' })
	@Type(type => Number)
	size: number
}

export class NoticeResolver {
	@ApiProperty({ description: 'message', example: '接口提示' })
	message: string
}
