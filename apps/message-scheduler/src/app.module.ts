import { Module } from '@nestjs/common'
import { LoggerModule } from '@/module/logger.module'
import { AppController } from '@message-scheduler/app.controller'
import { AppService } from '@message-scheduler/app.service'
import { createUniClientProvider } from '@message-scheduler/uni.provider'

@Module({
	imports: [LoggerModule.forRoot({ name: 'Message-Scheduler' })],
	controllers: [AppController],
	providers: [createUniClientProvider(), AppService]
})
export class AppModule {}
