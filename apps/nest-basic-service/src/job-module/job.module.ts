import { Module, Global } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { BullModule } from '@nestjs/bull'
import { JobService } from '@/job-module/job.service'
/**人机验证队列**/
import { JOB_CAPTCHA_SUPERVISOR } from '@/captcha-module/config/job-redis.resolver'
import { JobCaptchaSupervisorConsumer } from '@/job-module/job-captcha/job-captcha.supervisor.consumer'
/**邮件队列**/
import { JOB_MAILER_SCHEDULE, JOB_MAILER_EXECUTE } from '@/mailer-module/config/job-redis.resolver'
import { JobMailerScheduleConsumer } from '@/job-module/job-mailer/job-mailer.schedule.consumer'
import { JobMailerExecuteConsumer } from '@/job-module/job-mailer/job-mailer.execute.consumer'

@Global()
@Module({
	imports: [
		BullModule.registerQueue({
			name: JOB_CAPTCHA_SUPERVISOR.name,
			defaultJobOptions: {
				removeOnComplete: JOB_CAPTCHA_SUPERVISOR.removeOnComplete,
				removeOnFail: JOB_CAPTCHA_SUPERVISOR.removeOnFail
			}
		}),
		BullModule.registerQueue({
			name: JOB_MAILER_SCHEDULE.name,
			defaultJobOptions: {
				removeOnComplete: JOB_MAILER_SCHEDULE.removeOnComplete,
				removeOnFail: JOB_MAILER_SCHEDULE.removeOnFail
			}
		}),
		BullModule.registerQueue({
			name: JOB_MAILER_EXECUTE.name,
			defaultJobOptions: {
				removeOnComplete: JOB_MAILER_EXECUTE.removeOnComplete,
				removeOnFail: JOB_MAILER_EXECUTE.removeOnFail
			}
		}),
		EventEmitterModule.forRoot()
	],
	providers: [JobService, JobCaptchaSupervisorConsumer, JobMailerScheduleConsumer, JobMailerExecuteConsumer],
	exports: [JobService]
})
export class JobModule {}
