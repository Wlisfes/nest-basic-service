import { Processor, Process } from '@nestjs/bull'
import { Job } from 'bull'
import { customProvider } from '@/utils/utils-configer'
const configer = customProvider()

@Processor({ name: configer.captchar.kueuer.name })
export class CaptcharKueuerConsumer {
	/**队列开始执行**/
	@Process()
	async process(job: Job<{ session: string; check: string }>) {
		console.log(job.data)
	}
}
