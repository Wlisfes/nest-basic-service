import { Controller } from '@nestjs/common'
import { AppService } from '@common/app.service'

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}
}
