import { Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { SupervisorController } from '@/module/supervisor/supervisor.controller'
import { SupervisorService } from '@/module/supervisor/supervisor.service'

@Module({
	imports: [EventEmitterModule.forRoot()],
	controllers: [SupervisorController],
	providers: [SupervisorService]
})
export class SupervisorModule {}
