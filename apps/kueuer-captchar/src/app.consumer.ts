import { Processor, Process } from '@nestjs/bull'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Job } from 'bull'
import { CustomService } from '@/service/custom.service'
import { divineHandler } from '@/utils/utils-common'
import { TableCaptcharRecord } from '@/entity/tb-common.captchar__record'
import { CustomProvider } from '@/utils/utils-configer'
const configer = CustomProvider()

@Processor({ name: configer.kueuer.captchar.name })
export class AppCaptcharKueuerConsumer extends CustomService {
	constructor(@InjectRepository(TableCaptcharRecord) public readonly tableCaptcharRecord: Repository<TableCaptcharRecord>) {
		super()
	}

	/**队列开始执行**/ //prettier-ignore
	@Process()
	async process(job: Job<Record<string, never>>) {
		console.log('Kueuer-Captchar消费者：', job.id)
		await divineHandler(job.data.status === 'none', async () => {
			return await this.customeUpdate(this.tableCaptcharRecord,
				{ session: job.data.session },
				{ status: 'invalid' }
			)
		})
		return await job.progress(100)
	}
}
