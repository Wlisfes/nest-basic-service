import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { Queue } from 'bull'
import { InjectQueue } from '@nestjs/bull'
import { CustomProvider } from '@/utils/utils-configer'
const configer = CustomProvider()

@Injectable()
export class AppService {
	constructor(@InjectQueue(configer.kueuer.captchar.name) public readonly kueuer: Queue) {}

	/**创建延时队列**/
	public async createJobKueuer(data: Record<string, never>, delay: number = configer.kueuer.captchar.delay) {
		try {
			return await this.kueuer.add(data, { delay, jobId: data.session })
		} catch (e) {
			throw new HttpException('队列创建失败', HttpStatus.INTERNAL_SERVER_ERROR)
		}
	}

	/**更新队列data信息**/
	public async updateJobKueuer(jobId: string, data: Record<string, never>) {
		try {
			return await this.kueuer.getJob(jobId).then(async job => {
				return await job.update({ ...job.data, ...data })
			})
		} catch (e) {
			throw new HttpException('更新队列失败', HttpStatus.INTERNAL_SERVER_ERROR)
		}
	}
}
