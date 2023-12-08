import { Inject } from '@nestjs/common'
import { Processor, Process } from '@nestjs/bull'
import { Job } from 'bull'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'
import { CustomService } from '@/service/custom.service'
import { DataBaseService } from '@/service/database.service'
import { divineHandler } from '@/utils/utils-common'
import { custom } from '@/utils/utils-configer'

@Processor({ name: custom.captchar.kueuer.bull.name })
export class AppCaptcharKueuerConsumer extends CustomService {
	constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger, private readonly dataBase: DataBaseService) {
		super()
	}

	/**队列开始执行**/
	@Process()
	async process(job: Job<Record<string, any>>) {
		this.logger.info(AppCaptcharKueuerConsumer.name, {
			log: Object.assign(job.data, {
				jobId: job.opts.jobId,
				delay: job.opts.delay,
				timestamp: job.timestamp
			})
		})
		await divineHandler(job.data.status === 'none', async () => {
			return await this.customeUpdate(this.dataBase.tableCaptcharRecord, {
				condition: { session: job.data.session },
				state: { status: 'invalid' }
			})
		})
		return await job.progress(100)
	}
}
