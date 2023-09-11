import { ApiProperty, PickType, IntersectionType } from '@nestjs/swagger'
import { IsNotEmpty, IsObject, IsNumber, IsString, IsArray, Min, Max } from 'class-validator'
import { Type } from 'class-transformer'
import { IsOptional } from '@/decorator/common.decorator'
import { Request } from '@/interface/common.interface'

export class MailerTemplate extends PickType(Request, ['id']) {
	@ApiProperty({ description: 'App ID', example: 1692282119673627 })
	@IsNotEmpty({ message: 'App ID 必填' })
	@Type(type => Number)
	appId: number

	@ApiProperty({ description: '模板名称' })
	@IsNotEmpty({ message: '模板名称 必填' })
	name: string

	@ApiProperty({ description: '模板内容-MJML' })
	@IsNotEmpty({ message: '模板内容-MJML 必填' })
	mjml: string

	@ApiProperty({ description: '模板内容-JSON' })
	@IsNotEmpty({ message: '模板内容-JSON 必填' })
	@IsObject({ message: '模板内容-JSON 格式错误' })
	json: Object

	@ApiProperty({
		description: '状态: 待审核-pending、审核中-loading、已审核-review、未通过-rejected、禁用-disable、删除-delete',
		example: 'pending',
		default: 'pending'
	})
	@IsNotEmpty({ message: '模板状态 必填' })
	@Type(type => String)
	status: string
}

/**创建模板**/
export class CreateTemplate extends PickType(MailerTemplate, ['name', 'mjml', 'json']) {}

/**模板列表**/
export class ColumnTemplate extends IntersectionType(PickType(Request, ['page', 'size']), PickType(MailerTemplate, [])) {}

/**邮件模板信息**/
export class BasicTemplate extends PickType(MailerTemplate, ['id']) {}
