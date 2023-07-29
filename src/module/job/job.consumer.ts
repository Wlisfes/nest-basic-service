import { Logger } from '@nestjs/common'
import {
	Processor,
	Process,
	OnQueueProgress,
	OnQueueCompleted,
	OnQueueFailed,
	OnQueuePaused,
	OnQueueResumed,
	OnQueueRemoved
} from '@nestjs/bull'
import { Job } from 'bull'
import * as JobName from '@/config/job-config'

@Processor({ name: JobName.JOB_SUPERVISOR })
export class JobConsumer {
	private readonly logger = new Logger(JobConsumer.name)

	/**队列开始执行**/
	@Process()
	async onProcess(job: Job<unknown>) {
		this.logger.log('任务开始', job.id, job.data)
		await new Promise(resolve => {
			setTimeout(() => {
				resolve('')
			}, 3000)
		})
		this.logger.log('任务结束', job.id, job.data)
		// return await job.progress(100)
	}

	/**队列进度更新**/
	@OnQueueProgress()
	async onProgress(job: Job<unknown>) {
		console.log('OnQueueProgress：', typeof job.progress())
		console.log('OnQueueProgress：', job.data)
		if (job.progress() === 100) {
			await job.finished() /**进度为100、队列已完成**/
			// return await job.remove()
			return await job.moveToCompleted()
		}
	}

	/**队列执行成功**/
	@OnQueueCompleted()
	async onCompleted(job: Job<unknown>) {
		console.log('OnQueueCompleted：', job.data)
	}

	/**队列执行失败**/
	@OnQueueFailed()
	async onFailed(job: Job<unknown>) {
		console.log('OnQueueFailed：', job.data)
	}

	/**队列被暂停**/
	@OnQueuePaused()
	async onPaused(job: Job<unknown>) {
		console.log('OnQueuePaused：', job.data)
	}

	/**队列被恢复**/
	@OnQueueResumed()
	async onResumed(job: Job<unknown>) {
		console.log('OnQueueResumed：', job.data)
	}

	/**队列被成功移除**/
	@OnQueueRemoved()
	async onRemoved(job: Job<unknown>) {
		console.log('OnQueueRemoved：', job.data)
	}
}
