import { Controller, Post, Put, Get, Body, Request, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiDecorator } from '@/decorator/compute.decorator'
import { UserService } from '@/module/user/user.service'
import { ResultNotice } from '@/interface/common.interface'
import * as httpUser from '@/interface/user.interface'

@ApiTags('用户模块')
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('/register')
	@ApiDecorator({
		operation: { summary: '注册用户' },
		response: { status: 200, description: 'OK', type: ResultNotice }
	})
	public async httpRegister(@Body() body: httpUser.RequestRegister) {
		return await this.userService.httpRegister(body)
	}
}
