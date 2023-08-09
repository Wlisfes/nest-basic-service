import { Module } from '@nestjs/common'
import { AppService } from './app/app.service'
import { AppController } from './app/app.controller'
import { NodemailerService } from './nodemailer/nodemailer.service'
import { NodemailerController } from './nodemailer/nodemailer.controller'

@Module({
	controllers: [AppController, NodemailerController],
	providers: [AppService, NodemailerService]
})
export class MailerModule {}
