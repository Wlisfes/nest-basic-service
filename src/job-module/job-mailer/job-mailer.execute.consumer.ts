import { Logger } from '@nestjs/common'
import { Processor, Process, OnQueueProgress, OnQueueCompleted, OnQueueFailed, OnQueueRemoved } from '@nestjs/bull'
import { Job } from 'bull'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import { divineHandler, divineDelay } from '@/utils/utils-common'
import { JOB_MAILER_EXECUTE } from '@/mailer-module/config/job-redis.resolver'

@Processor({ name: JOB_MAILER_EXECUTE.name })
export class JobMailerExecuteConsumer extends CoreService {
	private readonly logger = new Logger(JobMailerExecuteConsumer.name)
	constructor(private readonly event: EventEmitter2, private readonly entity: EntityService) {
		super()
	}

	/**执行自定义发送**/
	private async createCustomizeExecute() {}

	/**执行模板发送**/
	private async createSampleExecute() {}

	/**队列开始执行**/
	@Process({ name: JOB_MAILER_EXECUTE.process.execute })
	async onProcess(job: Job<any>) {
		this.logger.log('process---邮件发送中:', job.data)
		if (job.data.super === 'sample') {
			/**发送模板消息**/
		} else if (job.data.super === 'customize') {
			/**发送自定义消息**/
		}

		await job.progress(100)
		return await job.discard()
	}
}
