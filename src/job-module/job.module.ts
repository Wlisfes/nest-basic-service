import { Module, Global } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { BullModule } from '@nestjs/bull'
import { JOB_SUPERVISOR } from '@/config/job-config'
import { JobService } from './job.service'
import { JobSupervisorConsumer } from './job.supervisor.consumer'

@Global()
@Module({
	imports: [
		BullModule.registerQueue({
			name: JOB_SUPERVISOR.name,
			limiter: JOB_SUPERVISOR.limiter,
			defaultJobOptions: {
				removeOnComplete: JOB_SUPERVISOR.removeOnComplete,
				removeOnFail: JOB_SUPERVISOR.removeOnFail
			}
		}),
		EventEmitterModule.forRoot()
	],
	providers: [JobService, JobSupervisorConsumer],
	exports: [JobService]
})
export class JobModule {}
