import { ApiProperty, PickType, IntersectionType, PartialType } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { Type } from 'class-transformer'
import { RequestCommon } from '@/interface/common.interface'

export class RequestSupervisor extends PickType(RequestCommon, ['id', 'uid', 'createTime', 'updateTime']) {
	@ApiProperty({ description: '图形宽度', example: 310 })
	@IsNotEmpty({ message: '图形宽度 必填' })
	@Type(type => Number)
	width: number

	@ApiProperty({ description: '图形高度', example: 160 })
	@IsNotEmpty({ message: '图形高度 必填' })
	@Type(type => Number)
	height: number

	@ApiProperty({ description: '偏移量', example: 59 })
	@IsNotEmpty({ message: '偏移量 必填' })
	@Type(type => Number)
	offset: number

	@ApiProperty({ description: '应用key', example: 'sFnFysvpL0DFGs6H' })
	@IsNotEmpty({ message: '应用key 必填' })
	appKey: string

	@ApiProperty({ description: '校验凭证' })
	@IsNotEmpty({ message: '校验凭证 必填' })
	token: number

	@ApiProperty({ description: '来源域名' })
	referer: number

	@ApiProperty({ description: 'RequestID' })
	requestId: number

	@ApiProperty({ description: 'Y轴位置' })
	pinY: number

	@ApiProperty({ description: 'X轴位置' })
	pinX: number

	@ApiProperty({ description: '校验状态: NODE：未验证、SUCCESS：验证成功、FAILURE：验证失败', example: 'NODE' })
	check: string
}

/**注册验证码配置**/
export class RequestReducer extends PickType(RequestSupervisor, ['width', 'height', 'offset', 'appKey']) {}
export class ResultReducer extends PickType(RequestSupervisor, ['pinX', 'pinX']) {}
