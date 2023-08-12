import { Controller, Get, Post, Body, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiDecorator } from '@/decorator/compute.decorator'
import { Notice } from '@/interface/common.interface'
import { PackageService } from './package.service'
import * as http from '../interface/package.interface'

@ApiTags('套餐包模块')
@Controller('package')
export class PackageController {
	constructor(private readonly packageService: PackageService) {}

	@Post('/mailer/create')
	@ApiDecorator({
		operation: { summary: '创建邮件套餐包' },
		response: { status: 200, description: 'OK', type: Notice }
	})
	public async httpCreateMailerPackage(@Body() body: http.CreateMailer) {
		return await this.packageService.httpCreateMailerPackage(body)
	}

	@Get('/mailer/column')
	@ApiDecorator({
		operation: { summary: '邮件套餐包列表' },
		// response: { status: 200, description: 'OK', type: Notice }
		customize: { status: 200, description: 'OK', type: Notice }
	})
	public async httpColumnMailerPackage(@Query() query: http.ColumnMailer) {
		return await this.packageService.httpColumnMailerPackage(query)
	}
}
