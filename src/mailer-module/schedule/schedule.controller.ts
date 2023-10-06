import { Controller, Post, Get, Put, Body, Query, Request, Response } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiDecorator } from '@/decorator/compute.decorator'
import { Notice } from '@/interface/common.interface'
import { RedisService } from '@/core/redis.service'
import { ScheduleService } from '@/mailer-module/schedule/schedule.service'
import { sampleTransfer } from '@/mailer-module/nodemailer/nodemailer.provider'
import * as http from '@/mailer-module/interface/schedule.interface'

@ApiTags('邮件任务模块')
@Controller('mailer/schedule')
export class ScheduleController {
	constructor(private readonly scheduleService: ScheduleService, private readonly redisService: RedisService) {}

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

	@Post('/sample/reducer')
	@ApiDecorator({
		operation: { summary: '创建模板发送队列' },
		response: { status: 200, description: 'OK', type: Notice },
		authorize: { login: true, error: true }
	})
	public async httpScheduleSampleReducer(@Request() request, @Body() body: http.ScheduleSampleReducer) {
		return await this.scheduleService.httpScheduleSampleReducer(body, request.user.uid)
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

	@Get('/column')
	@ApiDecorator({
		operation: { summary: '任务队列列表' },
		customize: { status: 200, description: 'OK', type: http.MailerSchedule },
		authorize: { login: true, error: true }
	})
	public async httpColumnSchedule(@Request() request, @Query() query: http.ColumnSchedule) {
		return await this.scheduleService.httpColumnSchedule(query, request.user.uid)
	}
}
