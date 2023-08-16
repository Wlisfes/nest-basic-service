import { Controller, Post, Put, Get, Body, Request, Query, Headers } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiDecorator } from '@/decorator/compute.decorator'
import { Notice } from '@/interface/common.interface'
import { UserService } from './user.service'
import * as http from '../interface/user.interface'

@ApiTags('用户模块')
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('/register')
	@ApiDecorator({
		operation: { summary: '注册用户' },
		response: { status: 200, description: 'OK', type: Notice }
	})
	public async httpRegister(@Body() body: http.Register) {
		return await this.userService.httpRegister(body)
	}

	@Post('/authorize')
	@ApiDecorator({
		operation: { summary: '登录' },
		response: { status: 200, description: 'OK' }
	})
	public async httpAuthorize(@Body() body: http.Authorize, @Headers() headers) {
		return await this.userService.httpAuthorize(body, headers.origin)
	}

	@Get('/basic-authorize')
	@ApiDecorator({
		operation: { summary: '用户信息' },
		response: { status: 200, description: 'OK', type: http.ResultBasicUser },
		authorize: { login: true, error: true }
	})
	public async httpBasicAuthorize(@Request() request: { user: http.BasicUser }) {
		return await this.userService.httpBasicAuthorize(request.user.uid)
	}
}
