import { Module } from '@nestjs/common'
import { AppService } from './app.service'
import { AppController } from './app.controller'
import { SupervisorService } from './supervisor.service'
import { SupervisorController } from './supervisor.controller'

@Module({
	controllers: [AppController, SupervisorController],
	providers: [AppService, SupervisorService]
})
export class CaptchaModule {}
