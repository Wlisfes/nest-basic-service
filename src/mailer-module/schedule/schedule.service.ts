import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { Brackets } from 'typeorm'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import { JobService } from '@/job-module/job.service'
import { divineHandler } from '@/utils/utils-common'
import { JOB_MAILER_SCHEDULE } from '@/config/job-config'

@Injectable()
export class ScheduleService extends CoreService {
	constructor(private readonly entity: EntityService, private readonly job: JobService) {
		super()
	}

	/**创建发送队列**/
	public async httpScheduleReducer() {
		return await this.RunCatch(async i18n => {
			const node = await this.entity.mailerSchedule.create({
				name: '刀剑神域',
				type: 'immediate',
				super: 'customize',
				total: 100,
				success: 0,
				failure: 0,
				content: '<h1>Holle word</h1>',
				status: 'pending',
				sendTime: new Date()
			})
			return await this.entity.mailerSchedule.save(node).then(async data => {
				const job = await this.job.mailer.add(
					JOB_MAILER_SCHEDULE.process.schedule,
					{
						id: data.id,
						name: '刀剑神域',
						type: 'immediate',
						super: 'customize',
						total: 100,
						success: 0,
						failure: 0,
						content: '<h1>Holle word</h1>',
						receive: 'limvcfast@gmail.com'
					},
					{ delay: 0 }
				)
				return await this.entity.mailerSchedule.update({ id: data.id }, { jobId: job.id as number }).then(() => {
					return { message: '创建成功' }
				})
			})
		})
	}
}
