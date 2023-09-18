import { Module, Global } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { BullModule } from '@nestjs/bull'
import { JobService } from '@/job-module/job.service'
import { JOB_CAPTCHA_SUPERVISOR } from '@/job-module/job-captcha/job-captcha.config'
import { JobCaptchaSupervisorConsumer } from '@/job-module/job-captcha/job-captcha.supervisor.consumer'
import { JOB_MAILER_SCHEDULE } from '@/job-module/job-mailer/job-mailer.config'
import { JobMailerScheduleConsumer } from '@/job-module/job-mailer/job-mailer.schedule.consumer'

@Global()
@Module({
	imports: [
		BullModule.registerQueue({
			name: JOB_CAPTCHA_SUPERVISOR.name,
			limiter: JOB_CAPTCHA_SUPERVISOR.limiter,
			defaultJobOptions: {
				removeOnComplete: JOB_CAPTCHA_SUPERVISOR.removeOnComplete,
				removeOnFail: JOB_CAPTCHA_SUPERVISOR.removeOnFail
			}
		}),
		BullModule.registerQueue({
			name: JOB_MAILER_SCHEDULE.name,
			limiter: JOB_MAILER_SCHEDULE.limiter,
			defaultJobOptions: {
				removeOnComplete: JOB_MAILER_SCHEDULE.removeOnComplete,
				removeOnFail: JOB_MAILER_SCHEDULE.removeOnFail
			}
		}),
		EventEmitterModule.forRoot()
	],
	providers: [JobService, JobCaptchaSupervisorConsumer, JobMailerScheduleConsumer],
	exports: [JobService]
})
export class JobModule {}
