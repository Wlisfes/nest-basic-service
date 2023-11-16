import { Controller, Inject, Get } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { ClientProxy } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'
import { AppService } from '@common/app.service'

@Controller()
export class AppController {
	constructor(@Inject('CAPTCHAR_INSTANCE') private captchar: ClientProxy, private readonly appService: AppService) {}

	@MessagePattern({ cmd: 'connect:common' })
	public async createJobKueuer(data: Record<string, never>) {
		console.log(data)
		return data
	}

	@Get()
	async httpHelloer() {
		await firstValueFrom(this.captchar.send({ cmd: 'connect:captchar' }, { datetime: Date.now() }))
		return `Hello World: common`
	}
}
