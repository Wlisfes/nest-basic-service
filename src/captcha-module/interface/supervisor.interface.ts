import { ApiProperty, PickType, IntersectionType, PartialType } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { Type } from 'class-transformer'
import { Request } from '@/interface/common.interface'

export class Supervisor extends PickType(Request, ['id', 'uid', 'createTime', 'updateTime']) {
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

	@ApiProperty({ description: 'App ID', example: 1692282119673627 })
	@IsNotEmpty({ message: 'App ID 必填' })
	@Type(type => Number)
	appId: number

	@ApiProperty({ description: '应用密钥' })
	@IsNotEmpty({ message: '应用密钥 必填' })
	appSecret: string

	@ApiProperty({ description: '校验凭证' })
	@IsNotEmpty({ message: '校验凭证 必填' })
	token: string

	@ApiProperty({ description: 'session记录' })
	@IsNotEmpty({ message: 'session记录 必填' })
	session: string

	@ApiProperty({ description: '来源域名' })
	referer: string

	@ApiProperty({ description: 'Y轴位置' })
	pinY: number

	@ApiProperty({ description: 'X轴位置' })
	pinX: number

	@ApiProperty({ description: '校验状态: NODE：未验证、SUCCESS：验证成功、FAILURE：验证失败', example: 'NODE' })
	check: string
}

/**注册验证码配置**/
export class Reducer extends PickType(Supervisor, ['width', 'height', 'offset', 'appId']) {}
export class ResultReducer extends PickType(Supervisor, ['pinX', 'pinX']) {}

/**生成校验凭证**/
export class Authorize extends PickType(Supervisor, ['session', 'appId']) {}
export class ResultAuthorize extends PickType(Supervisor, ['token']) {}

/**校验凭证**/
export class Inspector extends PickType(Supervisor, ['session', 'appId', 'appSecret', 'token']) {}

/**校验记录**/
export class ColumnSupervisor extends IntersectionType(PickType(Request, ['page', 'size']), PickType(Supervisor, [])) {}
