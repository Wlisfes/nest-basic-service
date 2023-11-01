import { Controller } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { AppService } from '@captchar-kueuer/app.service'

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@MessagePattern({ cmd: 'create_job_reducer' })
	public async createJobKueuer(data: Record<string, never>) {
		return await this.appService.createJobKueuer(data)
	}

	@MessagePattern({ cmd: 'update_job_reducer' })
	public async updateJobKueuer(data: Record<string, never>) {
		return await this.appService.updateJobKueuer(data.jobId, data.option)
	}
}
