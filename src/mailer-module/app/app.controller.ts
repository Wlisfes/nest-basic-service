import { Controller, Post, Get, Put, Body, Query, Request } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiDecorator } from '@/decorator/compute.decorator'
import { Notice } from '@/interface/common.interface'
import { AppService } from './app.service'
import * as http from '../interface/app.interface'

@ApiTags('邮件应用模块')
@Controller('mailer/app')
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
	public async httpUpdateBucket(@Request() request, @Body() body: http.UpdateBucket) {
		return await this.appService.httpUpdateBucket(body, request.user.uid)
	}

	@Get('/column')
	@ApiDecorator({
		operation: { summary: '应用列表' },
		customize: { status: 200, description: 'OK', type: http.MailerApplication },
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
	public async httpBasicApplication(@Request() request, @Query() query: http.BasicApplication) {
		return await this.appService.httpBasicApplication(query, request.user.uid)
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

	@Put('/reset/secret')
	@ApiDecorator({
		operation: { summary: '重置appSecret' },
		response: { status: 200, description: 'OK', type: Notice },
		authorize: { login: true, error: true }
	})
	public async httpResetMailerAppSecret(@Request() request, @Body() body: http.ResetMailerAppSecret) {
		return await this.appService.httpResetMailerAppSecret(body, request.user.uid)
	}

	@Post('/update/service')
	@ApiDecorator({
		operation: { summary: '添加、修改应用SMTP服务' },
		response: { status: 200, description: 'OK', type: Notice },
		authorize: { login: true, error: true }
	})
	public async httpUpdateMailerService(@Request() request, @Body() body: http.UpdateMailerService) {
		return await this.appService.httpUpdateMailerService(body, request.user.uid)
	}
}
