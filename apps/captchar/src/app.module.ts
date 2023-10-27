import { Module } from '@nestjs/common'
import { ConfigerModule } from '@/module/configer/configer.module'
import { DatabaseModule } from '@/module/database/database.module'
import { AppController } from '@captchar/app.controller'
import { AppService } from '@captchar/app.service'

@Module({
	imports: [ConfigerModule, DatabaseModule],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
