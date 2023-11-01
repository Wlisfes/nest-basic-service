import { Controller } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { AppService } from '@captchar-kueuer/app.service'

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@MessagePattern({ cmd: 'create_job_reducer' })
	httpAuthorizeReducer(data: any) {
		console.log(data)
		return data
	}
}
