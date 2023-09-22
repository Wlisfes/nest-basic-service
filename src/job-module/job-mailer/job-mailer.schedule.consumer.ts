import { Logger } from '@nestjs/common'
import { Processor, Process, OnQueueProgress, OnQueueCompleted, OnQueueFailed, OnQueueRemoved } from '@nestjs/bull'
import { Job } from 'bull'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import { divineHandler, divineDelay } from '@/utils/utils-common'
import { JOB_MAILER_SCHEDULE, JOB_MAILER_EXECUTE } from '@/mailer-module/config/job-redis.resolver'
import { JobService } from '@/job-module/job.service'

@Processor({ name: JOB_MAILER_SCHEDULE.name })
export class JobMailerScheduleConsumer extends CoreService {
	private readonly logger = new Logger(JobMailerScheduleConsumer.name)
	constructor(private readonly event: EventEmitter2, private readonly entity: EntityService, private readonly jobService: JobService) {
		super()
	}

	/**创建自定义发送队列**/
	private async createCustomizeExecute(data: any) {
		return await this.jobService.mailerExecute.add(JOB_MAILER_EXECUTE.process.execute, {})
	}

	/**创建模板发送队列**/
	private async createExecute(data: any) {
		// const sample =
		return await this.jobService.mailerExecute.add(JOB_MAILER_EXECUTE.process.execute, {})
	}

	/**队列开始执行**/
	@Process({ name: JOB_MAILER_SCHEDULE.process.schedule })
	async scheduleProcess(job: Job<any>) {
		this.logger.log('process---邮件任务队列开始执行:', `jobId: ${job.id}`)

		/**任务状态切换到-发送中**/
		await this.entity.mailerSchedule.update({ id: job.data.jobId }, { status: 'loading' })

		for (let index = 0; index < job.data.total; index++) {
			await this.jobService.mailerExecute.add(JOB_MAILER_EXECUTE.process.execute, {
				jobId: job.data.jobId,
				jobName: job.data.jobName,
				super: job.data.super,
				appId: job.data.appId,
				sampleId: job.data.sampleId,
				content: job.data.content ?? null,
				userId: job.data.userId,
				receive: 'limvcfast@gmail.com'
			})
			await job.progress(((index + 1) / job.data.total) * 100)
		}

		/**任务状态切换到-发送完成**/
		await this.entity.mailerSchedule.update({ id: job.data.jobId }, { status: 'fulfilled' })

		this.logger.log('process---邮件任务队列执行完毕:', `jobId: ${job.id}`)
		return await job.discard()
	}

	@OnQueueProgress({ name: JOB_MAILER_SCHEDULE.process.schedule })
	async scheduleProgress(job: Job<any>) {
		// console.log(job.progress(), job.data)
	}
}
