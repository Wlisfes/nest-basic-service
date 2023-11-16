import { Controller, Get } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { AppService } from '@common/app.service'

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@MessagePattern({ cmd: 'connect:common' })
	public async createJobKueuer(data: Record<string, never>) {
		console.log(data)
		return data
	}

	@Get()
	async httpHelloer() {
		return `Hello World: common`
	}
}
