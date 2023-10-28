import { Controller, Post, Get, Body, Query, Request } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CustomerService } from '@common/customer/customer.service'
import { ApiDecorator } from '@/decorator/compute.decorator'
import { NoticeResolver } from '@/interface/common.resolver'
import * as resolver from '@common/interface/customer.resolver'

@ApiTags('用户模块')
@Controller('customer')
export class CustomerController {
	constructor(private readonly customerService: CustomerService) {}

	@Post('/register')
	@ApiDecorator({
		operation: { summary: '注册用户' },
		response: { status: 200, description: 'OK', type: NoticeResolver }
	})
	public async httpRegisterCustomer(@Body() body: resolver.RegisterCustomer) {
		return await this.customerService.httpRegisterCustomer(body)
	}

	@Post('/authorize')
	@ApiDecorator({
		operation: { summary: '登录' },
		response: { status: 200, description: 'OK' }
	})
	public async httpAuthorizeCustomer(@Body() body: resolver.AuthorizeCustomer) {
		return await this.customerService.httpAuthorizeCustomer(body)
	}

	@Get('/bearer')
	@ApiDecorator({
		operation: { summary: '获取用户信息' },
		response: { status: 200, description: 'OK' }
	})
	public async httpBearerCustomer(@Query() query: resolver.BearerCustomer) {
		return await this.customerService.httpBearerCustomer(query)
	}
}
