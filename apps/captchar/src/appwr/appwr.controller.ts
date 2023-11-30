import { Controller, Post, Get, Query, Body, Request } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiDecorator } from '@/decorator/compute.decorator'
import { AppwrService } from '@captchar/appwr/appwr.service'
import { NoticeResolver } from '@/interface/common.resolver'
import * as dataBase from '@/entity'
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
	public async httpUpdateCaptcharAppwr(@Request() request, @Body() body: http.UpdateCaptcharAppwr) {
		return await this.appwrService.httpUpdateCaptcharAppwr(body, request.user.uid)
	}

	@Post('/reset/secret')
	@ApiDecorator({
		operation: { summary: '重置密钥' },
		response: { status: 200, description: 'OK', type: NoticeResolver },
		authorize: { login: true, error: true }
	})
	public async httpResetCaptcharSecret(@Request() request, @Body() body: http.ResetCaptcharSecret) {
		return await this.appwrService.httpResetCaptcharSecret(body, request.user.uid)
	}

	@Get('/resolver')
	@ApiDecorator({
		operation: { summary: '获取应用信息' },
		response: { status: 200, description: 'OK', type: dataBase.TableCustomer },
		authorize: { login: true, error: true }
	})
	public async httpResolverCaptcharAppwr(
		@Request() request: { user: dataBase.TableCustomer },
		@Query() query: http.ResolverCaptcharAppwr
	) {
		return await this.appwrService.httpResolverCaptcharAppwr(query, request.user.uid)
	}

	@Get('/column')
	@ApiDecorator({
		operation: { summary: '应用列表' },
		customize: { status: 200, description: 'OK', type: dataBase.TableCaptcharAppwr },
		authorize: { login: true, error: true }
	})
	public async httpColumnCaptcharAppwr(@Request() request, @Query() query: http.ColumnCaptcharAppwr) {
		return await this.appwrService.httpColumnCaptcharAppwr(query, request.user.uid)
	}
}
