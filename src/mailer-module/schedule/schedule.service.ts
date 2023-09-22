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

	/**创建自定义发送队列**/
	public async httpScheduleCustomizeReducer(props: http.ScheduleCustomizeReducer, uid: number) {
		return await this.RunCatch(async i18n => {
			// for (let index = 0; index < 10; index++) {
			// 	await this.jobService.mailerExecute.add(JOB_MAILER_EXECUTE.process.execute, {
			// 		uid,
			// 		props
			// 	})
			// }
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

	/**创建模板发送队列**/
	public async httpScheduleSampleReducer(props: http.ScheduleSampleReducer, uid: number) {
		return await this.RunCatch(async i18n => {
			const app = await this.validator({
				model: this.entity.mailerApplication,
				name: '应用',
				empty: { value: true },
				close: { value: true },
				delete: { value: true },
				options: {
					join: {
						alias: 'tb',
						leftJoinAndSelect: { user: 'tb.user' }
					},
					where: new Brackets(qb => {
						qb.where('tb.appId = :appId', { appId: props.appId })
						qb.andWhere('user.uid = :uid', { uid })
					})
				}
			})
			const sample = await this.validator({
				model: this.entity.mailerTemplate,
				name: '模板',
				empty: { value: true },
				close: { value: true },
				delete: { value: true },
				options: {
					join: {
						alias: 'tb',
						leftJoinAndSelect: { user: 'tb.user' }
					},
					where: new Brackets(qb => {
						qb.where('tb.id = :id', { id: props.sampleId })
						qb.andWhere('tb.status IN(:...status)', {
							status: ['pending', 'loading', 'review', 'rejected', 'disable', 'delete']
						})
						qb.andWhere('user.uid = :uid', { uid })
					})
				}
			}).then(async data => {
				await divineHandler(['pending', 'loading', 'rejected'].includes(data.status), () => {
					throw new HttpException(`模板未审核`, HttpStatus.BAD_REQUEST)
				})
				return data
			})
			const currTime = new Date()
			const sendTime = new Date(props.sendTime ?? currTime)
			const reduce = sendTime.getTime() - currTime.getTime()
			const node = await this.entity.mailerSchedule.create({
				super: 'sample',
				status: 'pending',
				name: props.name,
				type: props.type,
				total: 10,
				success: 0,
				failure: 0,
				sendTime,
				user: app.user,
				sample,
				app
			})
			return await this.entity.mailerSchedule.save(node).then(async data => {
				const job = await this.jobService.mailerSchedule.add(
					JOB_MAILER_SCHEDULE.process.schedule,
					{
						jobId: data.id, //任务ID
						jobName: data.name, //任务名称
						super: data.super, //发送类型: 模板发送-sample、自定义发送-customize
						total: data.total, //发送总数
						appId: props.appId, //应用ID
						sampleId: props.sampleId, //模板ID
						userId: uid //用户UID
					},
					{ delay: reduce > 0 ? reduce : 0 }
				)
				await this.entity.mailerSchedule.update({ id: data.id }, { jobId: job.id as number })
				return await divineResult({ message: '创建成功' })
			})
		})
	}
}
