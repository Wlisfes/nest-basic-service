import { Logger } from '@nestjs/common'
import { Processor, Process, OnQueueProgress, OnQueueCompleted, OnQueueFailed, OnQueueRemoved } from '@nestjs/bull'
import { Job } from 'bull'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import { divineHandler, divineDelay } from '@/utils/utils-common'
import { JOB_MAILER_SCHEDULE } from '@/config/job-config'

@Processor({ name: JOB_MAILER_SCHEDULE.name })
export class JobMailerScheduleConsumer extends CoreService {
	private readonly logger = new Logger(JobMailerScheduleConsumer.name)
	constructor(private readonly event: EventEmitter2, private readonly entity: EntityService) {
		super()
	}

	/**队列开始执行**/
	@Process({ name: JOB_MAILER_SCHEDULE.process.schedule })
	async process(job: Job<{ total: number; id: number }>) {
		this.logger.log('process---队列开始执行:', `jobId: ${job.id}`)
		console.log(job.data)
		await this.entity.mailerSchedule.update({ id: job.data.id }, { status: 'loading' })
		for (let index = 0; index < job.data.total; index++) {
			// await divineDelay(100)
			await this.entity.mailerSchedule.update({ id: job.data.id }, { success: index + 1 })
			this.logger.log('process---队列执行中:', `index: ${index}`)
		}
		await this.entity.mailerSchedule.update({ id: job.data.id }, { status: 'fulfilled' })
		await job.progress(100)
		this.logger.log('process---队列执行完毕:', `jobId: ${job.id}`)
		return await job.discard()
	}
}
