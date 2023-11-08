import { Controller, Post, Get, Body, Query, Request, Headers } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CustomerService } from '@common/customer/customer.service'
import { ApiDecorator } from '@/decorator/compute.decorator'
import { NoticeResolver } from '@/interface/common.resolver'
import { TableCustomer } from '@/entity/tb-common.customer'
import * as http from '@common/interface/customer.resolver'

import * as winston from 'winston'

const logger = winston.createLogger({
	level: 'debug',
	format: winston.format.simple(),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({
			dirname: 'log',
			filename: 'test.log'
		})
	]
})

@ApiTags('用户模块')
@Controller('customer')
export class CustomerController {
	constructor(private readonly customerService: CustomerService) {}

	@Post('/register')
	@ApiDecorator({
		operation: { summary: '注册用户' },
		response: { status: 200, description: 'OK', type: NoticeResolver }
	})
	public async httpRegisterCustomer(@Headers() headers, @Body() body: http.RegisterCustomer) {
		return await this.customerService.httpRegisterCustomer(body)
	}

	@Post('/authorize')
	@ApiDecorator({
		operation: { summary: '登录' },
		response: { status: 200, description: 'OK' }
	})
	public async httpAuthorizeCustomer(@Headers() headers, @Body() body: http.AuthorizeCustomer) {
		logger.error(CustomerController.name, 'httpAuthorizeCustomer', body)
		return await this.customerService.httpAuthorizeCustomer(body, headers.referer)
	}

	@Get('/resolver')
	@ApiDecorator({
		operation: { summary: '获取用户信息' },
		response: { status: 200, description: 'OK', type: TableCustomer },
		authorize: { login: true, error: true }
	})
	public async httpResolverCustomer(@Request() request: { user: TableCustomer }) {
		return await this.customerService.httpResolverCustomer({ uid: request.user.uid })
	}
}
