import { Module } from '@nestjs/common'
import { AppService } from './app/app.service'
import { AppController } from './app/app.controller'
import { NodemailerService } from './nodemailer/nodemailer.service'
import { MailerPackageService } from './package/package.service'
import { MailerPackageController } from './package/package.controller'
import { ScheduleService } from './schedule/schedule.service'
import { ScheduleController } from './schedule/schedule.controller'

@Module({
	controllers: [AppController, MailerPackageController, ScheduleController],
	providers: [AppService, NodemailerService, MailerPackageService, ScheduleService]
})
export class MailerModule {}
