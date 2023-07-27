import { Controller, Post, Put, Get, Body, Request, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiDecorator } from '@/decorator/compute.decorator'
import { AppService } from '@/module/app/app.service'
import { ResultNotice } from '@/interface/common.interface'
import * as http from '@/interface/app.interface'

@ApiTags('应用模块')
@Controller('app')
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Post('/create')
	@ApiDecorator({
		operation: { summary: '创建应用' },
		response: { status: 200, description: 'OK', type: ResultNotice }
	})
	public async httpCreateApp(@Body() body: http.RequestCreateApp) {
		return await this.appService.httpCreateApp(body)
	}

	@Post('/update/bucket')
	@ApiDecorator({
		operation: { summary: '编辑授权地址' },
		response: { status: 200, description: 'OK', type: ResultNotice }
	})
	public async httpUpdateBucket(@Body() body: http.RequestUpdateBucket) {
		return await this.appService.httpUpdateBucket(body)
	}

	@Get('/basic')
	@ApiDecorator({
		operation: { summary: '应用信息' },
		response: { status: 200, description: 'OK', type: ResultNotice }
	})
	public async httpBasicApp(@Query() query: http.RequestBasicApp) {
		return await this.appService.httpBasicApp(query)
	}
}
