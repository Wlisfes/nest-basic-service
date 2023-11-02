import { ApiProperty, PickType, IntersectionType } from '@nestjs/swagger'
import { TableCustomer } from '@/entity/tb-common.customer'
import { TableCaptcharRecord } from '@/entity/tb-common.captchar__record'

/**注册**/
export class RegisterCustomer extends PickType(TableCustomer, ['nickname', 'password']) {}

/**登录**/
export class AuthorizeCustomer extends IntersectionType(
	PickType(TableCustomer, ['mobile', 'password']),
	PickType(TableCaptcharRecord, ['session', 'token'])
) {}

/**获取用户信息**/
export class ResolverCustomer extends PickType(TableCustomer, ['uid']) {}
