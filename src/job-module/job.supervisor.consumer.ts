import { Logger } from '@nestjs/common'
import { Processor, Process, OnQueueProgress, OnQueueCompleted, OnQueueFailed, OnQueueRemoved } from '@nestjs/bull'
import { Job } from 'bull'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import { JOB_SUPERVISOR } from '@/config/job-config'

@Processor({ name: JOB_SUPERVISOR.name })
export class JobSupervisorConsumer extends CoreService {
	private readonly logger = new Logger(JobSupervisorConsumer.name)
	constructor(private readonly event: EventEmitter2, private readonly entity: EntityService) {
		super()
	}

	/**队列开始执行**/
	@Process()
	async process(job: Job<{ session: string; check: string }>) {
		this.logger.log('process---队列开始执行:', {
			jobId: job.id,
			data: job.data
		})
		const { session, check } = job.data
		if (check === 'NODE') {
			await this.entity.checkRecord.update({ session }, { check: 'INVALID' })
			await job.update({ session, check: 'INVALID' })
		}
		await job.progress(100)
		this.logger.log('process---队列执行完毕:', {
			jobId: job.id,
			data: job.data
		})
		return await job.discard()
		// return this.event.emit(JOB_SUPERVISOR.event.process, job)
	}

	/**队列进度更新**/
	@OnQueueProgress()
	onProgress(job: Job<unknown>) {
		// return this.event.emit(JOB_SUPERVISOR.event.progress, job)
	}

	/**队列执行成功**/
	@OnQueueCompleted()
	onCompleted(job: Job<unknown>) {
		// return this.event.emit(JOB_SUPERVISOR.event.completed, job)
	}

	/**队列执行失败**/
	@OnQueueFailed()
	onFailed(job: Job<unknown>) {
		// return this.event.emit(JOB_SUPERVISOR.event.failed, job)
	}

	/**队列被成功移除**/
	@OnQueueRemoved()
	onRemoved(job: Job<unknown>) {
		// return this.event.emit(JOB_SUPERVISOR.event.removed, job)
	}
}
