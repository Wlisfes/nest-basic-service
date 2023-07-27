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
		return await this.supervisorService.httpReducer(body, headers.origin)
	}

	@Post('/authorize')
	@ApiDecorator({
		operation: { summary: '生成校验凭证' },
		response: { status: 200, description: 'OK', type: http.ResultAuthorize }
	})
	public async httpAuthorize(@Headers() headers, @Body() body: http.RequestAuthorize) {
		return await this.supervisorService.httpAuthorize(body, headers.origin)
	}

	@Post('/inspector')
	@ApiDecorator({
		operation: { summary: '校验凭证' },
		response: { status: 200, description: 'OK', type: ResultNotice }
	})
	public async httpInspector(@Headers() headers, @Body() body: http.RequestInspector) {
		return await this.supervisorService.httpInspector(body, headers.origin)
	}
}
