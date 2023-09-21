import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { Brackets } from 'typeorm'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import { NodemailerService } from '@/mailer-module/nodemailer/nodemailer.service'
import { JobService } from '@/job-module/job.service'
import { divineHandler, divineResult } from '@/utils/utils-common'
import { JOB_MAILER_SCHEDULE, JOB_MAILER_EXECUTE } from '@/mailer-module/config/job-redis.resolver'
import * as http from '../interface/schedule.interface'

@Injectable()
export class ScheduleService extends CoreService {
	constructor(
		private readonly entity: EntityService,
		private readonly jobService: JobService,
		private readonly nodemailerService: NodemailerService
	) {
		super()
	}

	public async httpBasicSchedule() {
		return await this.nodemailerService.readCustomize()
	}

	/**自定义发送队列**/
	public async httpScheduleCustomizeReducer(props: http.ScheduleCustomizeReducer, uid: number) {
		return await this.RunCatch(async i18n => {
			for (let index = 0; index < 10; index++) {
				await this.jobService.mailerExecute.add(JOB_MAILER_EXECUTE.process.execute, {
					uid,
					props
				})
			}
			return await divineResult({ message: '创建成功' })
			// return await this.validator({
			// 	model: this.entity.mailerApplication,
			// 	name: '应用',
			// 	empty: { value: true },
			// 	options: {
			// 		join: {
			// 			alias: 'tb',
			// 			leftJoinAndSelect: {
			// 				user: 'tb.user',
			// 				service: 'tb.service'
			// 			}
			// 		},
			// 		where: new Brackets(qb => {
			// 			qb.where('tb.appId = :appId', { appId: props.appId })
			// 			qb.andWhere('tb.status IN(:...status)', { status: ['inactivated', 'activated', 'disable'] })
			// 			qb.andWhere('user.uid = :uid', { uid })
			// 		})
			// 	}
			// }).then(async data => {
			// 	await divineHandler(data.status === 'inactivated', () => {
			// 		throw new HttpException('应用未激活', HttpStatus.BAD_REQUEST)
			// 	})
			// 	await divineHandler(data.status === 'disable', () => {
			// 		throw new HttpException('应用已禁用', HttpStatus.BAD_REQUEST)
			// 	})
			// 	return await this.nodemailerService.httpCustomizeNodemailer({
			// 		appId: data.appId,
			// 		host: data.service.host,
			// 		port: data.service.port,
			// 		secure: data.service.secure,
			// 		user: data.service.username,
			// 		password: data.service.password,
			// 		from: `"妖雨纯" <${data.service.username}>`,
			// 		to: 'limvcfast@gmail.com',
			// 		subject: '温馨提示',
			// 		html: await this.nodemailerService.readCustomize()
			// 	})
			// })
		})
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
				const job = await this.jobService.mailerSchedule.add(
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
