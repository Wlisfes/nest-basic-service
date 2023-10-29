import { Controller, Post, Body, Headers } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { BrowserService } from '@captchar/browser/browser.service'
import { ApiDecorator } from '@/decorator/compute.decorator'
import * as http from '@captchar/interface/browser.resolver'

@ApiTags('验证码校验模块')
@Controller('browser')
export class BrowserController {
	constructor(private readonly browserService: BrowserService) {}

	@Post('/authorize')
	@ApiDecorator({
		operation: { summary: '生成校验凭证' },
		response: { status: 200, description: 'OK' }
	})
	public async httpAuthorizeReducer(@Headers() headers, @Body() body: http.AuthorizeReducer) {
		return await this.browserService.httpAuthorizeReducer(body)
	}
}
