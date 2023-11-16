import { Controller, Get } from '@nestjs/common'
import { AppService } from '@nodemailer/app.service'

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	async httpHelloer() {
		return `Hello World: nodemailer`
	}
}
