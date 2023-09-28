import { Controller, Post, Get, Put, Body, Query, Request, Response } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { ApiDecorator } from '@/decorator/compute.decorator'
import { Notice } from '@/interface/common.interface'
import { TemplateService } from '@/mailer-module/template/template.service'
import { faker, divineWritesheet } from '@/utils/utils-plugin'
import * as http from '@/mailer-module/interface/template.interface'

@ApiTags('邮件模板模块')
@Controller('mailer/template')
export class TemplateController {
	constructor(private readonly templateService: TemplateService) {}

	@Get('/test')
	@ApiDecorator({
		operation: { summary: '测试' },
		response: { status: 200, description: 'OK' }
	})
	public async test(@Response() response) {
		const jsonData = Array.from({ length: 10 }, () => {
			return {
				receive: faker.internet.email(),
				name: faker.person.fullName()
			}
		})
		const buffer = await divineWritesheet(jsonData, {
			columns: [
				{ header: 'Receive', key: 'receive', width: 30 },
				{ header: 'Name', key: 'name', width: 15 }
			]
		})
		response.set({
			'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			'Content-Disposition': 'attachment; filename="example.xlsx"'
		})
		return response.send(buffer)
	}

	@Post('/create')
	@ApiDecorator({
		operation: { summary: '创建邮件模板' },
		response: { status: 200, description: 'OK', type: Notice },
		authorize: { login: true, error: true }
	})
	public async httpCreateMailerTemplate(@Request() request, @Body() body: http.CreateTemplate) {
		return await this.templateService.httpCreateMailerTemplate(body, request.user.uid)
	}

	@Put('/update')
	@ApiDecorator({
		operation: { summary: '编辑邮件模板' },
		response: { status: 200, description: 'OK', type: Notice },
		authorize: { login: true, error: true }
	})
	public async httpUpdateMailerTemplate(@Request() request, @Body() body: http.UpdateTemplate) {
		return await this.templateService.httpUpdateMailerTemplate(body, request.user.uid)
	}

	@Get('/column')
	@ApiDecorator({
		operation: { summary: '邮件模板列表' },
		customize: { status: 200, description: 'OK', type: http.MailerTemplate },
		authorize: { login: true, error: true }
	})
	public async httpColumnMailerTemplate(@Request() request, @Query() query: http.ColumnTemplate) {
		return await this.templateService.httpColumnMailerTemplate(query, request.user.uid)
	}

	@Get('/basic')
	@ApiDecorator({
		operation: { summary: '邮件模板信息' },
		response: { status: 200, description: 'OK', type: http.MailerTemplate },
		authorize: { login: true, error: true }
	})
	public async httpBasicMailerTemplate(@Request() request, @Query() query: http.BasicTemplate) {
		return await this.templateService.httpBasicMailerTemplate(query, request.user.uid)
	}
}
