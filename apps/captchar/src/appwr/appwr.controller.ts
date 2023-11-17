import { Controller, Post, Get, Query, Body, Request } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiDecorator } from '@/decorator/compute.decorator'
import { AppwrService } from '@captchar/appwr/appwr.service'
import { NoticeResolver } from '@/interface/common.resolver'
import { TableCaptcharAppwr } from '@/entity/tb-common.captchar__appwr'
import * as http from '@captchar/interface/appwr.resolver'

@ApiTags('验证码应用模块')
@Controller('appwr')
export class AppwrController {
	constructor(private readonly appwrService: AppwrService) {}

	@Post('/create')
	@ApiDecorator({
		operation: { summary: '创建应用' },
		response: { status: 200, description: 'OK', type: NoticeResolver },
		authorize: { login: true, error: true }
	})
	public async httpCreateCaptcharAppwr(@Request() request, @Body() body: http.CreateCaptcharAppwr) {
		return await this.appwrService.httpCreateCaptcharAppwr(body, request.user.uid)
	}

	@Post('/update')
	@ApiDecorator({
		operation: { summary: '编辑应用' },
		response: { status: 200, description: 'OK', type: NoticeResolver },
		authorize: { login: true, error: true }
	})
	public async httpUpdateAppwr(@Request() request, @Body() body: http.UpdateAppwr) {
		return await this.appwrService.httpUpdateAppwr(body, request.user.uid)
	}

	@Get('/column')
	@ApiDecorator({
		operation: { summary: '应用列表' },
		customize: { status: 200, description: 'OK', type: TableCaptcharAppwr },
		authorize: { login: true, error: true }
	})
	public async httpColumnAppwr(@Request() request, @Query() query: http.ColumnAppwr) {
		return await this.appwrService.httpColumnAppwr(query, request.user.uid)
	}
}
