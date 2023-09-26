import { Logger } from '@nestjs/common'
import { Processor, Process, OnQueueProgress, OnQueueCompleted, OnQueueFailed, OnQueueRemoved } from '@nestjs/bull'
import { Job } from 'bull'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { CoreService } from '@/core/core.service'
import { RedisService } from '@/core/redis.service'
import { EntityService } from '@/core/entity.service'
import { useThrottle } from '@/hooks/hook-consumer'
import { divineHandler } from '@/utils/utils-common'
import { JOB_MAILER_SCHEDULE, JOB_MAILER_EXECUTE } from '@/mailer-module/config/job-redis.resolver'
import { createMailerScheduleCache } from '@/mailer-module/config/common-redis.resolver'
import { JobService } from '@/job-module/job.service'

@Processor({ name: JOB_MAILER_SCHEDULE.name })
export class JobMailerScheduleConsumer extends CoreService {
	private readonly logger = new Logger(JobMailerScheduleConsumer.name)
	constructor(
		private readonly event: EventEmitter2,
		private readonly entity: EntityService,
		private readonly jobService: JobService,
		private readonly redisService: RedisService
	) {
		super()
	}

	/**队列开始执行**/
	@Process({ name: JOB_MAILER_SCHEDULE.process.schedule })
	async onProcess(job: Job<any>) {
		this.logger.log(`process---${job.data.jobName}邮件任务队列开始执行:`, `jobId: ${job.id}`, job.data)

		const updateConsumer = useThrottle(3000)
		const { totalCache, successCache, failureCache } = createMailerScheduleCache(job.data.jobId)
		await this.redisService.setStore(totalCache, job.data.total)
		await this.redisService.setStore(successCache, 0)
		await this.redisService.setStore(failureCache, 0)

		for (let index = 1; index <= job.data.total; index++) {
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
				const progress = Number(((index / job.data.total) * 100).toFixed(2))
				await job.update({ ...job.data, submit: index })
				return job.progress(progress)
			})
		}

		/**任务状态切换到-发送完成**/
		await this.entity.mailerSchedule.update({ id: job.data.jobId }, { status: 'fulfilled' })

		this.logger.log(`process---${job.data.jobName}邮件任务队列执行完毕:`, `jobId: ${job.id}`, job.data)
		return await job.discard()
	}

	@OnQueueProgress({ name: JOB_MAILER_SCHEDULE.process.schedule })
	async onProgress(job: Job<any>) {
		/**更新任务进度**/
		console.log(`progress---${job.data.jobName}邮件任务进度: ${job.progress()}% :-----`, `jobId: ${job.id}`)
		const { submitCache, progressCache } = createMailerScheduleCache(job.data.jobId)
		await this.redisService.setStore(submitCache, job.data.submit)
		await this.redisService.setStore(progressCache, job.progress())
		await this.entity.mailerSchedule.update(
			{ id: job.data.jobId },
			{
				submit: job.data.submit,
				progress: job.progress()
			}
		)
	}
}
