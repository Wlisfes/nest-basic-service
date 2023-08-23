import { Controller, Post, Get, Put, Body, Query, Request, Response } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiDecorator } from '@/decorator/compute.decorator'
import { Notice } from '@/interface/common.interface'
import { ScheduleService } from './schedule.service'
import * as http from '../interface/schedule.interface'

@ApiTags('邮件任务模块')
@Controller('schedule')
export class ScheduleController {
	constructor(private readonly scheduleService: ScheduleService) {}

	@Get('/basic')
	@ApiDecorator({
		operation: { summary: '模板预览' },
		response: { status: 200, description: 'OK', type: Notice }
	})
	public async httpBasicSchedule(@Response() response) {
		const html = await this.scheduleService.httpBasicSchedule()
		// response.type('text/html')
		response.send(html)
	}

	@Post('/reducer')
	@ApiDecorator({
		operation: { summary: '创建发送队列' },
		response: { status: 200, description: 'OK', type: Notice }
	})
	public async httpScheduleReducer(@Body() body) {
		return await this.scheduleService.httpScheduleReducer()
	}

	@Post('/customize/reducer')
	@ApiDecorator({
		operation: { summary: '创建自定义发送队列' },
		response: { status: 200, description: 'OK', type: Notice },
		authorize: { login: true, error: true }
	})
	public async httpScheduleCustomizeReducer(@Request() request, @Body() body: http.ScheduleCustomizeReducer) {
		return await this.scheduleService.httpScheduleCustomizeReducer(body, request.user.uid)
	}
}
