import { Module } from '@nestjs/common'
import { ConfigerModule } from '@/module/configer/configer.module'
import { DatabaseModule } from '@/module/database/database.module'
import { AppController } from '@captchar/app.controller'
import { AppService } from '@captchar/app.service'
import { AppwrModule } from '@captchar/appwr/appwr.module'

@Module({
	imports: [ConfigerModule, DatabaseModule, AppwrModule],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
