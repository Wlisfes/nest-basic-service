import { Controller, Get } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { AppService } from '@captchar/app.service'

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@MessagePattern({ cmd: 'connect:captchar' })
	public async createJobKueuer(data: Record<string, never>) {
		console.log(data)
		return data
	}

	@Get()
	async httpHelloer() {
		return `Hello World: captchar`
	}
}
