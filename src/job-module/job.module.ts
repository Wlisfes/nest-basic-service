import { Module, Global } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { BullModule } from '@nestjs/bull'
import { JobService } from './job.service'
import { JobSupervisorConsumer } from './job.supervisor.consumer'
import { JobMailerScheduleConsumer } from './job-mailer.schedule.consumer'
import * as job from '@/config/job-config'

@Global()
@Module({
	imports: [
		BullModule.registerQueue({
			name: job.JOB_SUPERVISOR.name,
			limiter: job.JOB_SUPERVISOR.limiter,
			defaultJobOptions: {
				removeOnComplete: job.JOB_SUPERVISOR.removeOnComplete,
				removeOnFail: job.JOB_SUPERVISOR.removeOnFail
			}
		}),
		BullModule.registerQueue({
			name: job.JOB_MAILER_SCHEDULE.name,
			limiter: job.JOB_MAILER_SCHEDULE.limiter,
			defaultJobOptions: {
				removeOnComplete: job.JOB_MAILER_SCHEDULE.removeOnComplete,
				removeOnFail: job.JOB_MAILER_SCHEDULE.removeOnFail
			}
		}),
		EventEmitterModule.forRoot()
	],
	providers: [JobService, JobSupervisorConsumer, JobMailerScheduleConsumer],
	exports: [JobService]
})
export class JobModule {}
