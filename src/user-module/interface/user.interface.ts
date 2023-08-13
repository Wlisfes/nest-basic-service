import { ApiProperty, PickType, IntersectionType, PartialType } from '@nestjs/swagger'
import { IsNotEmpty, Length, IsNumber } from 'class-validator'
import { Type, Transform } from 'class-transformer'
import { IsOptional, IsMobile, TransferNumber } from '@/decorator/common.decorator'
import { Request } from '@/interface/common.interface'

export class User extends PickType(Request, ['id', 'uid']) {
	@ApiProperty({ description: '昵称', example: '猪头' })
	@IsNotEmpty({ message: '昵称 必填' })
	nickname: string

	@ApiProperty({ description: '手机号' })
	@IsNotEmpty({ message: '手机号 必填' })
	@IsMobile({ message: '手机号 格式错误' })
	mobile: string

	@ApiProperty({ description: '密码' })
	@IsNotEmpty({ message: '密码 必填' })
	@Length(6, 18, { message: '密码格式错误' })
	password: string

	@ApiProperty({ description: '头像', required: false })
	@IsOptional()
	avatar: string

	@ApiProperty({ description: '验证码' })
	@IsNotEmpty({ message: '验证码 必填' })
	@Length(4, 6, { message: '验证码错误' })
	code: string

	@ApiProperty({ description: 'session记录' })
	@IsNotEmpty({ message: 'session记录 必填' })
	session: string

	@ApiProperty({ description: '校验凭证' })
	@IsNotEmpty({ message: '校验凭证 必填' })
	token: string
}

/**注册用户**/
export class Register extends PickType(User, ['nickname', 'password', 'mobile', 'code']) {}

/**登录**/
export class Authorize extends PickType(User, ['mobile', 'password', 'session', 'token']) {}

/**用户信息**/
export class BasicUser extends PickType(User, ['uid']) {}

/**编辑用户信息**/
export class RequestUpdateUser extends PickType(User, ['uid']) {}

/**编辑用户权限**/
export class RequestUpdateAuthorize extends PickType(User, ['uid']) {}

/**用户列表**/
export class RequestColumnUser extends IntersectionType(
	PickType(Request, ['page', 'size']),
	PartialType(PickType(User, []))
) {}
