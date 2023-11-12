import { Controller } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { AppService } from '@kueuer-captchar/app.service'
import { custom } from '@/utils/utils-configer'

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@MessagePattern({ cmd: custom.captchar.kueuer.cmd.CreateJobKueuer })
	public async createJobKueuer(data: Record<string, never>) {
		return await this.appService.createJobKueuer(data)
	}

	@MessagePattern({ cmd: custom.captchar.kueuer.cmd.UpdateJobKueuer })
	public async updateJobKueuer(data: Record<string, never>) {
		return await this.appService.updateJobKueuer(data.jobId, data.option)
	}
}
