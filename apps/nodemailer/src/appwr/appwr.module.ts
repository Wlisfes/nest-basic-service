import { Module } from '@nestjs/common'
import { AppwrController } from '@nodemailer/appwr/appwr.controller'
import { AppwrService } from '@nodemailer/appwr/appwr.service'

@Module({
	imports: [],
	controllers: [AppwrController],
	providers: [AppwrService]
})
export class AppwrModule {}
