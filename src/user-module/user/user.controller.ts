import { Controller, Post, Put, Get, Body, Request, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiDecorator } from '@/decorator/compute.decorator'
import { ResultNotice } from '@/interface/common.interface'
import { UserService } from './user.service'
import * as http from '../interface/user.interface'

@ApiTags('用户模块')
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('/register')
	@ApiDecorator({
		operation: { summary: '注册用户' },
		response: { status: 200, description: 'OK', type: ResultNotice }
	})
	public async httpRegister(@Body() body: http.Register) {
		return await this.userService.httpRegister(body)
	}
}
