import { Logger } from '@nestjs/common'
import { Processor, Process, OnQueueProgress, OnQueueCompleted, OnQueueFailed, OnQueueRemoved } from '@nestjs/bull'
import { Job } from 'bull'
import { JOB_SUPERVISOR } from '@/config/job-config'

@Processor({ name: JOB_SUPERVISOR.name })
export class JobSupervisorConsumer {
	private readonly logger = new Logger(JobSupervisorConsumer.name)

	/**队列开始执行**/
	@Process()
	async onProcess(job: Job<unknown>) {
		this.logger.log('任务开始', job.id, job.isCompleted(), job.data)
		console.log({
			isCompleted: await job.isCompleted(),
			isActive: await job.isActive(),
			isFailed: await job.isFailed(),
			isDelayed: await job.isDelayed(),
			isStuck: await job.isStuck(),
			isWaiting: await job.isWaiting()
		})
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

	/**队列被成功移除**/
	@OnQueueRemoved()
	async onRemoved(job: Job<unknown>) {
		console.log('OnQueueRemoved：', job.data)
	}
}
