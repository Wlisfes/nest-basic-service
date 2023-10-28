import { ApiProperty, PickType } from '@nestjs/swagger'
import { TableCustomer } from '@/entity/tb-common.customer'

/**注册**/
export class RegisterCustomer extends PickType(TableCustomer, ['nickname', 'password']) {}

/**登录**/
export class AuthorizeCustomer extends PickType(TableCustomer, ['mobile', 'password']) {}

/**获取用户信息**/
export class BearerCustomer extends PickType(TableCustomer, ['uid']) {}
