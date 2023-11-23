import { ApiProperty, PickType, IntersectionType } from '@nestjs/swagger'
import { RequestResolver } from '@/interface/common.resolver'
import { TableCaptcharAppwr } from '@/entity/tb-common.captchar__appwr'
import { TableCaptcharRecord } from '@/entity/tb-common.captchar__record'

/**生成凭证**/
export class AuthorizeCaptcharReducer extends PickType(TableCaptcharAppwr, ['appId']) {}

/**校验凭证**/
export class AuthorizeCaptcharChecker extends IntersectionType(
	PickType(TableCaptcharAppwr, ['appId', 'appSecret']),
	PickType(TableCaptcharRecord, ['token', 'session'])
) {}

/**校验记录列表**/
export class ColumnCaptcharRecorder extends PickType(RequestResolver, ['page', 'size']) {}
