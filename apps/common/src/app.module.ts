import { Module } from '@nestjs/common'
import { ConfigerModule } from '@/module/configer/configer.module'
import { AppController } from '@common/app.controller'
import { AppService } from '@common/app.service'

@Module({
	imports: [ConfigerModule],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
