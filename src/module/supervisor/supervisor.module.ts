import { Module } from '@nestjs/common'
import { SupervisorController } from '@/module/supervisor/supervisor.controller'
import { SupervisorService } from '@/module/supervisor/supervisor.service'

@Module({
	controllers: [SupervisorController],
	providers: [SupervisorService],
	exports: [SupervisorService]
})
export class SupervisorModule {}
