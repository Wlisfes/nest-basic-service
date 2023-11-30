import { ApiProperty, PickType, IntersectionType } from '@nestjs/swagger'
import { RequestResolver } from '@/interface/common.resolver'
import { TableCaptcharAppwr } from '@/entity/tb-common.captchar__appwr'

/**创建应用**/
export class CreateCaptcharAppwr extends PickType(TableCaptcharAppwr, ['name']) {}

/**编辑应用**/
export class UpdateCaptcharAppwr extends PickType(TableCaptcharAppwr, ['appId', 'name']) {}

/**重置密钥**/
export class ResetCaptcharSecret extends PickType(TableCaptcharAppwr, ['appId']) {}

/**应用信息**/
export class ResolverCaptcharAppwr extends PickType(TableCaptcharAppwr, ['appId']) {}

/**应用列表**/
export class ColumnCaptcharAppwr extends PickType(RequestResolver, ['page', 'size']) {}
