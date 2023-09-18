import { Logger } from '@nestjs/common'
import { Processor, Process, OnQueueProgress, OnQueueCompleted, OnQueueFailed, OnQueueRemoved } from '@nestjs/bull'
import { Job } from 'bull'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import { divineHandler, divineDelay } from '@/utils/utils-common'
import { JOB_MAILER_EXECUTE } from '@/job-module/job-mailer/job-mailer.config'

@Processor({ name: JOB_MAILER_EXECUTE.name })
export class JobMailerExecuteConsumer extends CoreService {
	private readonly logger = new Logger(JobMailerExecuteConsumer.name)
	constructor(private readonly event: EventEmitter2, private readonly entity: EntityService) {
		super()
	}

	/**队列开始执行**/
	@Process({ name: JOB_MAILER_EXECUTE.process.execute })
	async Executeprocess(job: Job<{ id: number }>) {
		this.logger.log('process.execute---发送中:', `jobId: ${job.id}`)
		await job.progress(100)
		return await job.discard()
	}
}
