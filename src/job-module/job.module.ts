import { Module, Global } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { BullModule } from '@nestjs/bull'
import { JobService } from './job.service'
import { JobCaptchaSupervisorConsumer } from './job-captcha.supervisor.consumer'
import { JobMailerScheduleConsumer } from './job-mailer.schedule.consumer'
import * as job from '@/config/job-config'

@Global()
@Module({
	imports: [
		BullModule.registerQueue({
			name: job.JOB_CAPTCHA_SUPERVISOR.name,
			limiter: job.JOB_CAPTCHA_SUPERVISOR.limiter,
			defaultJobOptions: {
				removeOnComplete: job.JOB_CAPTCHA_SUPERVISOR.removeOnComplete,
				removeOnFail: job.JOB_CAPTCHA_SUPERVISOR.removeOnFail
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
	providers: [JobService, JobCaptchaSupervisorConsumer, JobMailerScheduleConsumer],
	exports: [JobService]
})
export class JobModule {}
