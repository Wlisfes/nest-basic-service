import { Processor, Process } from '@nestjs/bull'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Job } from 'bull'
import { CustomService } from '@/service/custom.service'
import { divineHandler } from '@/utils/utils-common'
import { TableCaptcharRecord } from '@/entity/tb-common.captchar__record'
import { custom } from '@/utils/utils-configer'

@Processor({ name: custom.captchar.kueuer.bull.name })
export class AppCaptcharKueuerConsumer extends CustomService {
	constructor(@InjectRepository(TableCaptcharRecord) public readonly tableCaptcharRecord: Repository<TableCaptcharRecord>) {
		super()
	}

	/**队列开始执行**/
	@Process()
	async process(job: Job<Record<string, never>>) {
		console.log('Captchar-Kueuer消费者：', job.id)
		await divineHandler(job.data.status === 'none', async () => {
			return await this.customeUpdate(this.tableCaptcharRecord, {
				condition: { session: job.data.session },
				state: { status: 'invalid' }
			})
		})
		return await job.progress(100)
	}
}
