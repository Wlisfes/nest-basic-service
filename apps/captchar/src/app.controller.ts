import { Controller, Inject, Get } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { ClientProxy } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'
import { AppService } from '@captchar/app.service'

@Controller()
export class AppController {
	constructor(@Inject('COMMON_INSTANCE') private common: ClientProxy, private readonly appService: AppService) {}

	@MessagePattern({ cmd: 'connect:captchar' })
	public async createJobKueuer(data: Record<string, never>) {
		console.log(data)
		return data
	}

	@Get()
	async httpHelloer() {
		await firstValueFrom(this.common.send({ cmd: 'connect:common' }, { datetime: Date.now() }))
		return `Hello World: captchar`
	}
}
