import { Controller, Post, Get, Put, Body, Query, Request } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiDecorator } from '@/decorator/compute.decorator'
import { Notice } from '@/interface/common.interface'
import { AppService } from './app.service'
import * as http from '../interface/app.interface'

@ApiTags('验证码应用模块')
@Controller('captcha/app')
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Post('/create')
	@ApiDecorator({
		operation: { summary: '创建应用' },
		response: { status: 200, description: 'OK', type: Notice },
		authorize: { login: true, error: true }
	})
	public async httpCreateApplication(@Request() request, @Body() body: http.CreateApplication) {
		return await this.appService.httpCreateApplication(body, request.user.uid)
	}

	@Post('/update/bucket')
	@ApiDecorator({
		operation: { summary: '编辑授权地址' },
		response: { status: 200, description: 'OK', type: Notice },
		authorize: { login: true, error: true }
	})
	public async httpUpdateBucket(@Body() body: http.UpdateBucket) {
		return await this.appService.httpUpdateBucket(body)
	}

	@Get('/column')
	@ApiDecorator({
		operation: { summary: '应用列表' },
		customize: { status: 200, description: 'OK', type: http.CaptchaApplication },
		authorize: { login: true, error: true }
	})
	public async httpColumnApplication(@Request() request, @Query() query: http.ColumnApplication) {
		return await this.appService.httpColumnApplication(query, request.user.uid)
	}

	@Get('/basic')
	@ApiDecorator({
		operation: { summary: '应用信息' },
		response: { status: 200, description: 'OK', type: Notice },
		authorize: { login: true, error: true }
	})
	public async httpBasicApp(@Query() query: http.BasicApplication) {
		return await this.appService.httpBasicApp(query)
	}

	@Put('/update/name')
	@ApiDecorator({
		operation: { summary: '修改应用名称' },
		response: { status: 200, description: 'OK', type: Notice },
		authorize: { login: true, error: true }
	})
	public async httpUpdateNameApplication(@Request() request, @Body() body: http.UpdateNameApplication) {
		return await this.appService.httpUpdateNameApplication(body, request.user.uid)
	}
}
