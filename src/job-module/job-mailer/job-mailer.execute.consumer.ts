import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Processor, Process, OnQueueProgress, OnQueueCompleted, OnQueueFailed, OnQueueRemoved } from '@nestjs/bull'
import { Job } from 'bull'
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule'
import { isEmpty } from 'class-validator'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { CoreService } from '@/core/core.service'
import { RedisService } from '@/core/redis.service'
import { EntityService } from '@/core/entity.service'
import { divineHandler, divineDelay } from '@/utils/utils-common'
import { moment, divineUnzipCompr, divineCompress } from '@/utils/utils-plugin'
import { readCompile } from '@/mailer-module/nodemailer/nodemailer.provider'
import { JOB_MAILER_EXECUTE } from '@/mailer-module/config/job-redis.resolver'
import { createUserBasicCache } from '@/user-module/config/common-redis.resolver'
import { createMailerAppCache, createMailerTemplateCache, createMailerScheduleCache } from '@/mailer-module/config/common-redis.resolver'

@Processor({ name: JOB_MAILER_EXECUTE.name })
export class JobMailerExecuteConsumer extends CoreService {
	private readonly logger = new Logger(JobMailerExecuteConsumer.name)
	private isCron: boolean = true
	constructor(
		private readonly event: EventEmitter2,
		private readonly entity: EntityService,
		private readonly redisService: RedisService,
		private readonly schedulerRegistry: SchedulerRegistry,
		private readonly configService: ConfigService
	) {
		super()
	}

	/**读取redis任务进度缓存**/
	public async readExecuteCache() {
		const prefix = await this.configService.get('NODE_ENV').trim()
		const { executeCache } = createMailerScheduleCache('*', prefix)
		const executeKeys = (await this.redisService.client.keys(executeCache)).map(key => key.replace(prefix, ''))
		if (executeKeys.length > 0) {
			const response = await this.redisService.client.mget(...executeKeys)
			return executeKeys.map((key, index) => ({
				jobId: Number(key.slice(key.lastIndexOf(':') + 1, key.length)),
				value: Number(response[index] ?? 0)
			}))
		} else {
			return []
		}
	}

	@Cron(CronExpression.EVERY_5_SECONDS, { name: JOB_MAILER_EXECUTE.CronSchedule })
	public async cronConsumer() {
		this.logger.debug('定时任务执行:', moment().format('YYYY-MM-DD HH:mm:ss'))
		const job = this.schedulerRegistry.getCronJob(JOB_MAILER_EXECUTE.CronSchedule)
		const schedule = await this.readExecuteCache()
		if (schedule.length > 0) {
			/**存在任务执行进度**/
			for (let index = 0; index < schedule.length; index++) {
				const cache = schedule[index]
				const { successCache, failureCache, totalCache, executeCache } = createMailerScheduleCache(cache.jobId)
				const total = await this.redisService.getStore<number>(totalCache)
				const success = await this.redisService.getStore<number>(successCache)
				const failure = await this.redisService.getStore<number>(failureCache)
				await this.entity.mailerSchedule.update({ id: cache.jobId }, { success, failure }).then(() => {
					return divineHandler(cache.value >= total, async () => {
						await this.redisService.delStore(executeCache)
					})
				})
			}
		} else {
			/**不存在任务执行进度、停止定时任务**/
			this.isCron = false
			job.stop()
		}
	}

	/**队列开始执行**/
	@Process({ name: JOB_MAILER_EXECUTE.process.execute })
	async onProcess(job: Job<any>) {
		// this.logger.log(`process---邮件发送中: jobId: ${job.id}------:`, job.data)
		const { successCache, failureCache, executeCache } = createMailerScheduleCache(job.data.jobId)
		const user = await this.redisService.getStore<any>(createUserBasicCache(job.data.userId))
		const app = await this.redisService.getStore<any>(createMailerAppCache(job.data.appId))
		await this.redisService.client.incr(executeCache)

		/**发送模板消息**/
		await divineHandler(job.data.super === 'sample', async () => {
			const sample = await this.redisService.getStore<any>(createMailerTemplateCache(job.data.sampleId))
			try {
				const buffer = Buffer.from(sample.mjml, 'base64')
				const mjml = await divineUnzipCompr<string>(buffer)
				const compile = await readCompile(mjml, job.data.state)
				const content = await divineCompress(compile)
				const node = await this.entity.mailerRecord.create({
					jobId: job.data.jobId,
					jobName: job.data.jobName,
					super: job.data.super,
					status: 'fulfilled',
					receive: job.data.receive,
					appId: job.data.appId,
					appName: app.name,
					sampleId: job.data.sampleId,
					sampleName: sample.name,
					content: content,
					userId: job.data.userId,
					nickname: user.nickname,
					avatar: user.avatar
				})
				await this.entity.mailerRecord.save(node).then(async () => {
					return await this.redisService.client.incr(successCache)
				})
			} catch (e) {
				console.log(e)
				return await this.redisService.client.incr(failureCache)
			}
		})

		/**发送自定义消息**/
		await divineHandler(job.data.super === 'customize', async () => {})

		/**判断定时任务是否在执行、不执行就启动定时任务**/
		await divineHandler(!this.isCron, () => {
			this.isCron = true
			const job = this.schedulerRegistry.getCronJob(JOB_MAILER_EXECUTE.CronSchedule)
			job.start()
		})
		await job.progress(100)
		return await job.discard()
	}
}
