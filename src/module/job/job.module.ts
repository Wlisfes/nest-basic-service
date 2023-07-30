import { Module, Global } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { BullModule } from '@nestjs/bull'
import { JobService } from '@/module/job/job.service'
import { JobSupervisorConsumer } from '@/module/job/job.supervisor.consumer'
import { JOB_SUPERVISOR } from '@/config/job-config'

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
