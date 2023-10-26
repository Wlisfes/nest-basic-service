import { Module } from '@nestjs/common'
import { AppService } from './app/app.service'
import { AppController } from './app/app.controller'
import { SupervisorService } from './supervisor/supervisor.service'
import { SupervisorController } from './supervisor/supervisor.controller'

@Module({
	controllers: [AppController, SupervisorController],
	providers: [AppService, SupervisorService]
})
export class CaptchaModule {}
