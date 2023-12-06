import { Controller } from '@nestjs/common'
import { AppService } from '@captchar-kueuer/app.service'

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}
}
