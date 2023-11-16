import { Controller, Get } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { AppService } from '@common/app.service'
import { custom } from '@/utils/utils-configer'

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@MessagePattern({ cmd: custom.common.instance.cmd.httpConnect })
	public async httpConnect(data: Record<string, never>) {
		return data
	}

	@Get()
	async httpHelloer() {
		return `Hello World: common`
	}
}
