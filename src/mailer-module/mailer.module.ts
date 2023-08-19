import { Module } from '@nestjs/common'
import { AppService } from './app/app.service'
import { AppController } from './app/app.controller'
import { NodemailerService } from './nodemailer/nodemailer.service'
import { NodemailerController } from './nodemailer/nodemailer.controller'
import { PackageService } from './package/package.service'
import { PackageController } from './package/package.controller'
import { ScheduleService } from './schedule/schedule.service';
import { ScheduleController } from './schedule/schedule.controller';

@Module({
	controllers: [AppController, NodemailerController, PackageController, ScheduleController],
	providers: [AppService, NodemailerService, PackageService, ScheduleService]
})
export class MailerModule {}
