import { Module } from '@nestjs/common'
import { ConfigerModule } from '@/module/configer.module'
import { CustomizeModule } from '@/module/customize.module'
import { DatabaseModule } from '@/module/database.module'
import { AppController } from '@nodemailer/app.controller'
import { AppService } from '@nodemailer/app.service'

@Module({
	imports: [ConfigerModule, CustomizeModule, DatabaseModule],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
