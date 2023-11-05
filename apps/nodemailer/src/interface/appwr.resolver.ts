import { ApiProperty, PickType, IntersectionType } from '@nestjs/swagger'
import { RequestResolver } from '@/interface/common.resolver'
import { TableNodemailerAppwr } from '@/entity/tb-common.nodemailer__appwr'

/**创建应用**/
export class CreateAppwr extends PickType(TableNodemailerAppwr, ['name']) {}

/**应用列表**/
export class ColumnAppwr extends PickType(RequestResolver, ['page', 'size']) {}
