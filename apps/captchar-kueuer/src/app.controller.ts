import { Controller } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { AppService } from '@captchar-kueuer/app.service'
import { custom } from '@/utils/utils-configer'

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@MessagePattern({ cmd: custom.captchar.kueuer.instance.cmd.httpUpdateJobKueuer })
	public async httpCreateJobKueuer(data: Record<string, never>) {
		return await this.appService.httpCreateJobKueuer(data)
	}

	@MessagePattern({ cmd: custom.captchar.kueuer.instance.cmd.httpUpdateJobKueuer })
	public async httpUpdateJobKueuer(data: Record<string, never>) {
		return await this.appService.httpUpdateJobKueuer(data.jobId, data.option)
	}
}
