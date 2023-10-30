import { Controller, Post, Body, Headers } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { BrowserService } from '@captchar/browser/browser.service'
import { ApiDecorator } from '@/decorator/compute.decorator'
import { TableCaptcharRecord } from '@/entity/tb-common.captchar__record'
import * as http from '@captchar/interface/browser.resolver'

@ApiTags('验证码校验模块')
@Controller('browser')
export class BrowserController {
	constructor(private readonly browserService: BrowserService) {}

	@Post('/authorize')
	@ApiDecorator({
		operation: { summary: '生成凭证' },
		response: { status: 200, description: 'OK', type: TableCaptcharRecord }
	})
	public async httpAuthorizeReducer(@Headers() headers, @Body() body: http.AuthorizeReducer) {
		return await this.browserService.httpAuthorizeReducer(body, headers.origin)
	}

	@Post('/authorize/checker')
	@ApiDecorator({
		operation: { summary: '校验凭证' },
		response: { status: 200, description: 'OK', type: TableCaptcharRecord }
	})
	public async httpAuthorizeChecker(@Headers() headers, @Body() body: http.AuthorizeChecker) {
		return await this.browserService.httpAuthorizeChecker(body, headers.origin)
	}
}
