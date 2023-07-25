import { ApiProperty, PickType, IntersectionType, PartialType } from '@nestjs/swagger'
import { IsNotEmpty, Length, IsNumber } from 'class-validator'
import { Type, Transform } from 'class-transformer'
import { IsOptional, IsMobile, TransferNumber } from '@/decorator/common.decorator'
import { RequestCommon } from '@/interface/common.interface'
import { at } from '@/i18n'

export class RequestUser extends PickType(RequestCommon, ['id', 'uid']) {
	@ApiProperty({ description: '昵称', example: '猪头' })
	@IsNotEmpty({ message: '' })
	nickname: string

	@ApiProperty({ description: '密码' })
	@IsNotEmpty({ message: at('user.password.required') })
	@Length(6, 18, { message: at('user.password.format') })
	password: string

	@ApiProperty({ description: '头像', required: false })
	@IsOptional()
	avatar: string

	@ApiProperty({ description: 'OpenID' })
	@IsNotEmpty({ message: at('user.openid.required') })
	openid: string

	@ApiProperty({ description: '验证码' })
	@IsNotEmpty({ message: at('user.code.required') })
	@Length(4, 6, { message: at('user.code.error') })
	code: string
}

/**注册用户**/
export class RequestRegister extends PickType(RequestUser, ['nickname', 'password', 'mobile', 'code']) {}

/**登录**/
export class RequestAuthorize extends PickType(RequestUser, ['mobile', 'password', 'code']) {}

/**用户信息**/
export class RequestBasicUser extends PickType(RequestUser, ['uid']) {}

/**编辑用户信息**/
export class RequestUpdateUser extends PickType(RequestUser, ['uid']) {}

/**编辑用户权限**/
export class RequestUpdateAuthorize extends PickType(RequestUser, ['uid']) {}

/**用户列表**/
export class RequestColumnUser extends IntersectionType(
	PickType(RequestCommon, ['page', 'size']),
	PartialType(PickType(RequestUser, []))
) {}
