import { ApiProperty, PickType, IntersectionType } from '@nestjs/swagger'
import { TableCaptcharAppwr } from '@/entity/tb-common.captchar__appwr'

/**创建应用**/
export class CreateAppwr extends PickType(TableCaptcharAppwr, ['name']) {}
