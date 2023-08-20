import { Controller, Post, Get, Put, Body, Query, Request } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiDecorator } from '@/decorator/compute.decorator'
import { Notice } from '@/interface/common.interface'
import { ScheduleService } from './schedule.service'
import * as http from '../interface/schedule.interface'

@ApiTags('邮件任务模块')
@Controller('schedule')
export class ScheduleController {
	constructor(private readonly scheduleService: ScheduleService) {}

	@Post('/reducer')
	@ApiDecorator({
		operation: { summary: '创建发送队列' },
		response: { status: 200, description: 'OK', type: Notice }
	})
	public async httpScheduleReducer(@Body() body) {
		return await this.scheduleService.httpScheduleReducer()
	}
}
