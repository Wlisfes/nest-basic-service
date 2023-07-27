import { Controller, Post, Put, Get, Body, Request, Headers, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiDecorator } from '@/decorator/compute.decorator'
import { SupervisorService } from '@/module/supervisor/supervisor.service'
import { ResultNotice } from '@/interface/common.interface'
import * as http from '@/interface/supervisor.interface'

@ApiTags('验证模块')
@Controller('supervisor')
export class SupervisorController {
	constructor(private readonly supervisorService: SupervisorService) {}

	@Post('/reducer')
	@ApiDecorator({
		operation: { summary: '注册验证码配置' },
		response: { status: 200, description: 'OK', type: http.ResultReducer }
	})
	public async httpReducer(@Headers() headers, @Body() body: http.RequestReducer) {
		console.log(headers)
		return headers
		return await this.supervisorService.httpReducer(body)
	}
}
