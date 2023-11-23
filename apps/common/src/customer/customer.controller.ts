import { Controller, Post, Get, Body, Query, Request, Headers } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CacheCustomer } from '@/cache/cache-common.service'
import { CustomerService } from '@common/customer/customer.service'
import { ApiDecorator } from '@/decorator/compute.decorator'
import { NoticeResolver } from '@/interface/common.resolver'
import * as dataBase from '@/entity'
import * as http from '@common/interface/customer.resolver'

@ApiTags('用户模块')
@Controller('customer')
export class CustomerController {
	constructor(private readonly cacheCustomer: CacheCustomer, private readonly customerService: CustomerService) {}

	@Post('/register')
	@ApiDecorator({
		operation: { summary: '注册用户' },
		response: { status: 200, description: 'OK', type: NoticeResolver }
	})
	public async httpRegisterCustomer(@Headers() headers, @Body() body: http.RegisterCustomer) {
		console.log(`1211111`)
		return await this.customerService.httpRegisterCustomer(body)
	}

	@Post('/authorize')
	@ApiDecorator({
		operation: { summary: '登录' },
		response: { status: 200, description: 'OK' }
	})
	public async httpAuthorizeCustomer(@Headers() headers, @Body() body: http.AuthorizeCustomer) {
		return await this.customerService.httpAuthorizeCustomer(body, headers.referer)
	}

	@Get('/resolver')
	@ApiDecorator({
		operation: { summary: '获取用户信息' },
		response: { status: 200, description: 'OK', type: dataBase.TableCustomer },
		authorize: { login: true, error: true }
	})
	public async httpResolverCustomer(@Request() request: { user: dataBase.TableCustomer }) {
		return await this.customerService.httpResolverCustomer({ uid: request.user.uid })
	}
}
