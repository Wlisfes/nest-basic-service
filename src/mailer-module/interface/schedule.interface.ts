import { ApiProperty, PickType, IntersectionType } from '@nestjs/swagger'
import { IsNotEmpty, IsDate } from 'class-validator'
import { Type } from 'class-transformer'
import { IsOptional } from '@/decorator/common.decorator'
import { Request } from '@/interface/common.interface'

export class MailerSchedule {
	@ApiProperty({ description: '任务名称', example: '中秋活动' })
	@IsNotEmpty({ message: '任务名称 必填' })
	name: string

	@ApiProperty({ description: '任务类型: 定时任务-schedule、即时任务-immediate', example: 'immediate' })
	@IsNotEmpty({ message: '任务类型 必填' })
	type: string

	@ApiProperty({ description: '发送内容', example: '<h1>Holle word</h1>' })
	@IsNotEmpty({ message: '发送内容 必填' })
	content: string

	@ApiProperty({ description: '定时发送时间', required: false, example: '2023-08-23 15:30:00' })
	@IsOptional()
	@IsDate({ message: '定时发送时间 格式错误' })
	sendTime: string

	@ApiProperty({ description: 'App ID', example: 1692282119673627 })
	@IsNotEmpty({ message: 'App ID 必填' })
	@Type(type => Number)
	appId: number

	@ApiProperty({ description: '模板 ID', example: 20 })
	@IsNotEmpty({ message: '模板 必填' })
	@Type(type => Number)
	sampleId: number
}

/**创建模板发送队列**/
export class ScheduleSampleReducer extends PickType(MailerSchedule, ['appId', 'name', 'type', 'sendTime', 'sampleId']) {}

/**创建自定义发送队列**/
export class ScheduleCustomizeReducer extends PickType(MailerSchedule, ['appId', 'name', 'type', 'sendTime', 'content']) {}
