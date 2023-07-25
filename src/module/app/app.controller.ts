import { Controller, Post, Put, Get, Body, Request, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiDecorator } from '@/decorator/compute.decorator'
import { AppService } from '@/module/app/app.service'
import { ResultNotice } from '@/interface/common.interface'
import * as httpApp from '@/interface/app.interface'

@ApiTags('应用模块')
@Controller('app')
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Post('/create')
	@ApiDecorator({
		operation: { summary: '创建应用' },
		response: { status: 200, description: 'OK', type: ResultNotice }
	})
	public async httpCreateApp(@Body() body: httpApp.RequestCreateApp) {
		return await this.appService.httpCreateApp(body)
	}
}
