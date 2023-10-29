import { ApiProperty, PickType, IntersectionType } from '@nestjs/swagger'
import { TableCaptcharAppwr } from '@/entity/tb-common.captchar__appwr'

/**注册验证码配置**/
export class AuthorizeReducer extends PickType(TableCaptcharAppwr, ['appId']) {}
