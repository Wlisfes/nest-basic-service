import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { AppController } from '@message/app.controller'
import { AppService } from '@message/app.service'
import { createUniClientProvider } from '@message-scheduler/uni.provider'

@Module({
	imports: [HttpModule],
	controllers: [AppController],
	providers: [createUniClientProvider(), AppService]
})
export class AppModule {}
