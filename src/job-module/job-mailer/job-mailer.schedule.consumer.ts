import { Logger } from '@nestjs/common'
import { Processor, Process, OnQueueProgress, OnQueueCompleted, OnQueueFailed, OnQueueRemoved } from '@nestjs/bull'
import { Job } from 'bull'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import { useThrottle } from '@/hooks/hook-consumer'
import { JOB_MAILER_SCHEDULE, JOB_MAILER_EXECUTE } from '@/mailer-module/config/job-redis.resolver'
import { JobService } from '@/job-module/job.service'

@Processor({ name: JOB_MAILER_SCHEDULE.name })
export class JobMailerScheduleConsumer extends CoreService {
	private readonly logger = new Logger(JobMailerScheduleConsumer.name)
	constructor(private readonly event: EventEmitter2, private readonly entity: EntityService, private readonly jobService: JobService) {
		super()
	}

	/**队列开始执行**/
	@Process({ name: JOB_MAILER_SCHEDULE.process.schedule })
	async onProcess(job: Job<any>) {
		this.logger.log('process---邮件任务队列开始执行:', `jobId: ${job.id}`)
		const updateConsumer = useThrottle(2500)

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
			await updateConsumer(async () => {
				const value = (((index + 1) / job.data.total) * 100).toFixed(2)
				await job.update(Object.assign(job.data, { submit: index + 1 }))
				return await job.progress(Number(value))
			})
		}

		/**任务状态切换到-发送完成**/
		await this.entity.mailerSchedule.update({ id: job.data.jobId }, { status: 'fulfilled' })

		this.logger.log('process---邮件任务队列执行完毕:', `jobId: ${job.id}`)
		return await job.discard()
	}

	@OnQueueProgress({ name: JOB_MAILER_SCHEDULE.process.schedule })
	async onProgress(job: Job<any>) {
		/**更新任务进度**/
		await this.entity.mailerSchedule.update(
			{ id: job.data.jobId },
			{
				submit: job.data.submit,
				progress: job.progress()
			}
		)
	}
}
