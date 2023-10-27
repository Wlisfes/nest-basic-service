import { Controller, Get } from '@nestjs/common'
import { AppService } from '@captchar/app.service'

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}
}
