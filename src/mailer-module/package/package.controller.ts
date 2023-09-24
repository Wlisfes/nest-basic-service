import { Controller, Get, Post, Body, Query, Request } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiDecorator } from '@/decorator/compute.decorator'
import { Notice } from '@/interface/common.interface'
import { MailerPackageService } from './package.service'
import * as http from '../interface/package.interface'

@ApiTags('邮件套餐包模块')
@Controller('mailer/package')
export class MailerPackageController {
	constructor(private readonly packageService: MailerPackageService) {}

	@Post('/create')
	@ApiDecorator({
		operation: { summary: '创建邮件套餐包' },
		response: { status: 200, description: 'OK', type: Notice }
	})
	public async httpCreateMailerPackage(@Body() body: http.CreateMailerPackage) {
		return await this.packageService.httpCreateMailerPackage(body)
	}

	@Get('/column')
	@ApiDecorator({
		operation: { summary: '邮件套餐包列表' },
		customize: { status: 200, description: 'OK', type: Notice }
	})
	public async httpColumnBundleMailer() {
		return await this.packageService.httpColumnBundleMailer()
	}

	@Post('/subscriber')
	@ApiDecorator({
		operation: { summary: '购买邮件套餐包' },
		response: { status: 200, description: 'OK', type: Notice },
		authorize: { login: true, error: true }
	})
	public async httpMailerPackageSubscriber(@Request() request, @Body() body: http.MailerPackageSubscriber) {
		return await this.packageService.httpMailerPackageSubscriber(body, request.user.uid)
	}

	@Get('/compute')
	@ApiDecorator({
		operation: { summary: '资源包统计' },
		response: { status: 200, description: 'OK', type: Notice },
		authorize: { login: true, error: true }
	})
	public async httpUserComputeMailer(@Request() request) {
		return await this.packageService.httpUserComputeMailer(request.user.uid)
	}

	@Get('/user/column')
	@ApiDecorator({
		operation: { summary: '用户资源包列表' },
		response: { status: 200, description: 'OK', type: Notice },
		authorize: { login: true, error: true }
	})
	public async httpColumnUserMailer(@Request() request, @Query() query: http.ColumnUserMailer) {
		return await this.packageService.httpColumnUserMailer(query, request.user.uid)
	}
}
