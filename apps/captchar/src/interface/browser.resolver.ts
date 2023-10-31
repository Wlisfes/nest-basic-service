import { ApiProperty, PickType, IntersectionType } from '@nestjs/swagger'
import { TableCaptcharAppwr } from '@/entity/tb-common.captchar__appwr'
import { TableCaptcharRecord } from '@/entity/tb-common.captchar__record'

/**生成凭证**/
export class AuthorizeReducer extends PickType(TableCaptcharAppwr, ['appId']) {}

/**校验凭证**/
export class AuthorizeChecker extends IntersectionType(
	PickType(TableCaptcharAppwr, ['appId', 'appSecret']),
	PickType(TableCaptcharRecord, ['token', 'session'])
) {}
