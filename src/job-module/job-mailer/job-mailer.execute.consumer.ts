import { Logger } from '@nestjs/common'
import { Processor, Process, OnQueueProgress, OnQueueCompleted, OnQueueFailed, OnQueueRemoved } from '@nestjs/bull'
import { Job } from 'bull'
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule'
import { isEmpty } from 'class-validator'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { CoreService } from '@/core/core.service'
import { RedisService } from '@/core/redis.service'
import { EntityService } from '@/core/entity.service'
import { useThrottle } from '@/hooks/hook-consumer'
import { moment, divineHandler, divineDelay, divineCompress } from '@/utils/utils-common'
import { JOB_MAILER_EXECUTE } from '@/mailer-module/config/job-redis.resolver'
import { createUserBasicCache } from '@/user-module/config/common-redis.resolver'
import { createMailerAppCache, createMailerTemplateCache, createMailerScheduleCache } from '@/mailer-module/config/common-redis.resolver'

const consumer = new Map<number, Function>()
const success = new Map<number, number>()
const failure = new Map<number, number>()

@Processor({ name: JOB_MAILER_EXECUTE.name })
export class JobMailerExecuteConsumer extends CoreService {
	private readonly logger = new Logger(JobMailerExecuteConsumer.name)
	private isCron: boolean = true
	constructor(
		private readonly event: EventEmitter2,
		private readonly entity: EntityService,
		private readonly redisService: RedisService,
		private readonly schedulerRegistry: SchedulerRegistry
	) {
		super()

		// this.redisService.client.lrange(`:mailer:job:schedule:progress`, 0, -1, (err, r) => {
		// 	console.log(err, r)
		// 	this.logger.debug(`CronConsumer: `, moment().format('YYYY-MM-DD HH:mm:ss'))
		// })
	}

	@Cron(CronExpression.EVERY_5_SECONDS, { name: JOB_MAILER_EXECUTE.CronSchedule })
	async cronConsumer() {
		const { successCache, failureCache } = createMailerScheduleCache(23)
		const failure = await this.redisService.getStore(failureCache)
		const success = await this.redisService.client.keys(successCache.slice(1))
		console.log({
			successCache,
			failureCache,
			failure,
			success,
			keys: await this.redisService.client.keys('*')
		})

		// const cacheName = createMailerScheduleCache()
		// const job = this.schedulerRegistry.getCronJob(JOB_MAILER_EXECUTE.CronSchedule)
		// this.redisService.client.lrange(cacheName, 0, -1, async (err, response = []) => {
		// 	await this.redisService.client.ltrim(cacheName, 0, -(response.length + 1))
		// 	console.log(response)
		// 	if (response.length === 0) {
		// 		this.isCron = false
		// 		job.stop()
		// 	}
		// 	this.logger.debug(`CronConsumer: `, moment().format('YYYY-MM-DD HH:mm:ss'))
		// })
		// this.redisService.client.ltrim(`:mailer:job:schedule:progress`, 0, 4, async (err, r) => {
		// 	console.log(err, e, r)
		// 	this.logger.debug(`CronConsumer: `, moment().format('YYYY-MM-DD HH:mm:ss'))
		// })
	}

	/**队列开始执行**/
	@Process({ name: JOB_MAILER_EXECUTE.process.execute })
	async onProcess(job: Job<any>) {
		// this.logger.log(`process---邮件发送中: jobId: ${job.id}------:`, job.data)
		const { successCache, failureCache } = createMailerScheduleCache(job.data.jobId)
		const user = await this.redisService.getStore<any>(createUserBasicCache(job.data.userId))
		const app = await this.redisService.getStore<any>(createMailerAppCache(job.data.appId))

		/**添加任务成功数缓存**/
		await divineHandler(isEmpty(success.get(job.data.jobId)), () => {
			return success.set(job.data.jobId, 0)
		})

		/**添加任务失败数缓存**/
		await divineHandler(isEmpty(failure.get(job.data.jobId)), () => {
			return failure.set(job.data.jobId, 0)
		})

		/**添加任务节流操作缓存**/
		await divineHandler(!consumer.get(job.data.jobId), () => {
			const update = useThrottle(5000)
			return consumer.set(
				job.data.jobId,
				update(async () => {
					return await this.entity.mailerSchedule.update(
						{ id: job.data.jobId },
						{
							success: success.get(job.data.jobId),
							failure: failure.get(job.data.jobId)
						}
					)
				})
			)
		})

		await this.redisService.client.incr(successCache)

		/**发送模板消息**/
		await divineHandler(job.data.super === 'sample', async () => {
			// await success.set(job.data.jobId, (success.get(job.data.jobId) ?? 0) + 1)
			// const sample = await this.redisService.getStore<any>(createMailerTemplateCache(job.data.sampleId))
			// const content = await divineCompress(sample.mjml)
			// const node = await this.entity.mailerRecord.create({
			// 	super: 'sample',
			// 	status: 'fulfilled',
			// 	receive: job.data.receive,
			// 	jobId: job.data.jobId,
			// 	jobName: job.data.jobName,
			// 	appId: app.appId,
			// 	appName: app.name,
			// 	sampleId: sample.id,
			// 	sampleName: sample.name,
			// 	sampleCover: sample.cover,
			// 	sampleContent: content,
			// 	userId: user.uid,
			// 	nickname: user.nickname,
			// 	avatar: user.avatar
			// })
			// await this.entity.mailerRecord.save(node)
		})

		/**发送自定义消息**/
		await divineHandler(job.data.super === 'customize', async () => {})

		/**执行节流操作更新**/
		// const updateConsumer = consumer.get(job.data.jobId)
		// await updateConsumer()

		// await divineHandler(!this.isCron, () => {
		// 	this.isCron = true
		// 	const job = this.schedulerRegistry.getCronJob(JOB_MAILER_EXECUTE.CronSchedule)
		// 	job.start()
		// })
		await job.progress(100)
		return await job.discard()
	}
}
