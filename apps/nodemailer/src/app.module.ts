import { Module } from '@nestjs/common'
import { ConfigerModule } from '@/module/configer/configer.module'
import { AppController } from '@nodemailer/app.controller'
import { AppService } from '@nodemailer/app.service'

@Module({
	imports: [ConfigerModule],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
