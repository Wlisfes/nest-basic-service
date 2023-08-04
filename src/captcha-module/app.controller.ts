import { Controller, Post, Get, Body, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiDecorator } from '@/decorator/compute.decorator'
import { ResultNotice } from '@/interface/common.interface'
import { AppService } from './app.service'
import * as http from './interface/app.interface'

@ApiTags('应用模块')
@Controller('captcha/app')
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Post('/create')
	@ApiDecorator({
		operation: { summary: '创建应用' },
		response: { status: 200, description: 'OK', type: ResultNotice }
	})
	public async httpCreateApplication(@Body() body: http.CreateApplication) {
		return await this.appService.httpCreateApplication(body)
	}

	@Post('/update/bucket')
	@ApiDecorator({
		operation: { summary: '编辑授权地址' },
		response: { status: 200, description: 'OK', type: ResultNotice }
	})
	public async httpUpdateBucket(@Body() body: http.UpdateBucket) {
		return await this.appService.httpUpdateBucket(body)
	}

	@Get('/basic')
	@ApiDecorator({
		operation: { summary: '应用信息' },
		response: { status: 200, description: 'OK', type: ResultNotice }
	})
	public async httpBasicApp(@Query() query: http.BasicApplication) {
		return await this.appService.httpBasicApp(query)
	}
}
