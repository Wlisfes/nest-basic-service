import { ApiProperty, PickType, IntersectionType } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsArray } from 'class-validator'
import { Type } from 'class-transformer'
import { IsOptional, IsDateCustomize } from '@/decorator/common.decorator'
import { Request } from '@/interface/common.interface'

export class MailerSchedule {
	@ApiProperty({ description: '任务ID', example: 65 })
	@IsNotEmpty({ message: '任务ID 必填' })
	jobId: number

	@ApiProperty({ description: '任务名称', example: '中秋活动' })
	@IsNotEmpty({ message: '任务名称 必填' })
	name: string

	@ApiProperty({ description: '任务类型: 定时任务-schedule、即时任务-immediate', example: 'immediate' })
	@IsNotEmpty({ message: '任务类型 必填' })
	type: string

	@ApiProperty({ description: '发送类型: 模板发送-sample、自定义发送-customize', example: 'sample' })
	@IsNotEmpty({ message: '发送类型 必填' })
	super: string

	@ApiProperty({ description: '接收类型: 接收列表文件-excel、自定义接收-customize', example: 'customize' })
	@IsNotEmpty({ message: '接收类型 必填' })
	accept: string

	@ApiProperty({ description: '发送总数', example: 100 })
	total: number

	@ApiProperty({ description: '队列提交数', example: 100 })
	submit: number

	@ApiProperty({ description: '成功数', example: 100 })
	success: number

	@ApiProperty({ description: '失败数', example: 0 })
	failure: number

	@ApiProperty({ description: '发送进度', example: 100 })
	progress: number

	@ApiProperty({ description: '发送内容', example: '<h1>Holle word</h1>' })
	@IsNotEmpty({ message: '发送内容 必填' })
	content: string

	@ApiProperty({ description: '定时发送时间', required: false, example: '2023-08-23 15:30:00' })
	@IsOptional()
	@IsDateCustomize({ message: '定时发送时间 格式错误' })
	sendTime: string

	@ApiProperty({ description: 'App ID', example: 1692282119673627 })
	@IsNotEmpty({ message: 'App ID 必填' })
	@Type(type => Number)
	appId: number

	@ApiProperty({ description: '模板 ID', example: 28 })
	@IsNotEmpty({ message: '模板 必填' })
	@Type(type => Number)
	sampleId: number

	@ApiProperty({ description: '发送文件ID', required: false, example: '96846837895235297833' })
	@IsOptional()
	fileId: string

	@ApiProperty({ description: '发送文件原始名称', required: false, example: 'sample-100.xlsx' })
	fieldName: string

	@ApiProperty({
		description: '状态: 等待发送-pending、发送中-loading、发送完成-fulfilled、发送失败-rejected、手动关闭-closurer、系统关闭-automatic',
		required: false,
		example: 'pending'
	})
	status: string

	@ApiProperty({ description: '自定义接收列表', required: false })
	@IsOptional({}, { string: true, number: true })
	@IsArray({ message: '自定义接收列表 格式错误' })
	@IsString({ each: true })
	receive: string[]
}

/**创建模板发送队列**/
export class ScheduleSampleReducer extends IntersectionType(
	PickType(MailerSchedule, ['appId', 'name', 'type', 'sendTime', 'sampleId']),
	PickType(MailerSchedule, ['accept', 'fileId', 'receive'])
) {}

/**创建自定义发送队列**/
export class ScheduleCustomizeReducer extends IntersectionType(
	PickType(MailerSchedule, ['appId', 'name', 'type', 'accept', 'sendTime', 'content']),
	PickType(MailerSchedule, ['accept', 'fileId', 'receive'])
) {}

/**任务队列列表**/
export class ColumnSchedule extends IntersectionType(PickType(Request, ['page', 'size']), PickType(MailerSchedule, [])) {}
