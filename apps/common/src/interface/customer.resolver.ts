import { ApiProperty, PickType, IntersectionType } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { TableCustomer } from '@/entity/tb-common.customer'
import { TableCaptcharRecord } from '@/entity/tb-common.captchar__record'

/**注册**/
export class RegisterCustomer extends PickType(TableCustomer, ['nickname', 'password', 'mobile']) {
	@ApiProperty({ description: '验证码', example: '485963' })
	@IsNotEmpty({ message: '验证码 必填' })
	code: string
}

/**登录**/
export class AuthorizeCustomer extends IntersectionType(
	PickType(TableCustomer, ['mobile', 'password']),
	PickType(TableCaptcharRecord, ['session', 'token'])
) {}

/**获取用户信息**/
export class ResolverCustomer extends PickType(TableCustomer, ['uid']) {}
