import { Controller, Post, Get, Body, Headers, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiDecorator } from '@/decorator/compute.decorator'
import { ResultNotice } from '@/interface/common.interface'
import { SupervisorService } from './supervisor.service'
import * as http from '../interface/supervisor.interface'

@ApiTags('验证码校验模块')
@Controller('captcha/supervisor')
export class SupervisorController {
	constructor(private readonly supervisorService: SupervisorService) {}

	@Post('/reducer')
	@ApiDecorator({
		operation: { summary: '注册验证码配置' },
		response: { status: 200, description: 'OK', type: http.ResultReducer }
	})
	public async httpReducer(@Headers() headers, @Body() body: http.Reducer) {
		return await this.supervisorService.httpReducer(body, headers.origin)
	}

	@Post('/authorize')
	@ApiDecorator({
		operation: { summary: '生成校验凭证' },
		response: { status: 200, description: 'OK', type: http.ResultAuthorize }
	})
	public async httpAuthorize(@Headers() headers, @Body() body: http.Authorize) {
		return await this.supervisorService.httpAuthorize(body, headers.origin)
	}

	@Post('/inspector')
	@ApiDecorator({
		operation: { summary: '校验凭证' },
		response: { status: 200, description: 'OK', type: ResultNotice }
	})
	public async httpInspector(@Headers() headers, @Body() body: http.Inspector) {
		return await this.supervisorService.httpInspector(body, headers.origin)
	}

	@Get('/column')
	@ApiDecorator({
		operation: { summary: '校验记录' },
		response: { status: 200, description: 'OK', type: ResultNotice }
	})
	public async httpColumnSupervisor(@Query() query: http.ColumnSupervisor) {
		return await this.supervisorService.httpColumnSupervisor(query)
	}
}
