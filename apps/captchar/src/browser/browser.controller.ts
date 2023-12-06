import { Controller, Post, Get, Body, Query, Headers, Request } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { BrowserService } from '@captchar/browser/browser.service'
import { ApiDecorator } from '@/decorator/compute.decorator'
import * as dataBase from '@/entity'
import * as http from '@captchar/interface/browser.resolver'

@ApiTags('验证码校验模块')
@Controller('browser')
export class BrowserController {
	constructor(private readonly browserService: BrowserService) {}

	@Post('/authorize')
	@ApiDecorator({
		operation: { summary: '生成凭证' },
		response: { status: 200, description: 'OK', type: dataBase.TableCaptcharRecord }
	})
	public async httpAuthorizeCaptcharReducer(@Headers() headers, @Body() body: http.AuthorizeCaptcharReducer) {
		return await this.browserService.httpAuthorizeCaptcharReducer(body, headers.origin)
	}

	@Post('/authorize/checker')
	@ApiDecorator({
		operation: { summary: '校验凭证' },
		response: { status: 200, description: 'OK', type: dataBase.TableCaptcharRecord }
	})
	public async httpAuthorizeCaptcharChecker(@Headers() headers, @Body() body: http.AuthorizeCaptcharChecker) {
		return await this.browserService.httpAuthorizeCaptcharChecker(body, headers.origin)
	}

	@Get('/column')
	@ApiDecorator({
		operation: { summary: '校验记录列表' },
		customize: { status: 200, description: 'OK', type: dataBase.TableCaptcharAppwr },
		authorize: { login: true, error: true }
	})
	public async httpColumnCaptcharRecorder(@Request() request, @Query() query: http.ColumnCaptcharRecorder) {
		return await this.browserService.httpColumnCaptcharRecorder(query, request.user.uid)
	}
}
