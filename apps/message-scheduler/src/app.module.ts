import { Module } from '@nestjs/common'
import { AppController } from '@message-scheduler/app.controller'
import { AppService } from '@message-scheduler/app.service'
import { createUniClientProvider } from '@message-scheduler/uni.provider'

@Module({
	imports: [],
	controllers: [AppController],
	providers: [createUniClientProvider(), AppService]
})
export class AppModule {}
