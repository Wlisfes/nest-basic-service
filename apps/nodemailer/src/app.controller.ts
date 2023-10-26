import { Controller } from '@nestjs/common'
import { AppService } from '@nodemailer/app.service'

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}
}
