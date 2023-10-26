import { Module } from '@nestjs/common'
import { AppService } from '@/mailer-module/app/app.service'
import { AppController } from '@/mailer-module/app/app.controller'
import { NodemailerService } from '@/mailer-module/nodemailer/nodemailer.service'
import { MailerPackageService } from '@/mailer-module/package/package.service'
import { MailerPackageController } from '@/mailer-module/package/package.controller'
import { ScheduleService } from '@/mailer-module/schedule/schedule.service'
import { ScheduleController } from '@/mailer-module/schedule/schedule.controller'
import { TemplateService } from '@/mailer-module/template/template.service'
import { TemplateController } from '@/mailer-module/template/template.controller'

@Module({
	controllers: [AppController, MailerPackageController, ScheduleController, TemplateController],
	providers: [AppService, NodemailerService, MailerPackageService, ScheduleService, TemplateService]
})
export class MailerModule {}
