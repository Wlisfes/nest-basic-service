import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { Brackets } from 'typeorm'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import { NodemailerService } from '@/mailer-module/nodemailer/nodemailer.service'
import { AppService } from '@/mailer-module/app/app.service'
import { TemplateService } from '@/mailer-module/template/template.service'
import { JobService } from '@/job-module/job.service'
import { divineHandler, divineResult } from '@/utils/utils-common'
import { divineCatchWherer } from '@/utils/utils-affair'
import { JOB_MAILER_SCHEDULE, JOB_MAILER_EXECUTE } from '@/mailer-module/config/job-redis.resolver'
import * as http from '../interface/schedule.interface'

@Injectable()
export class ScheduleService extends CoreService {
	constructor(
		private readonly entity: EntityService,
		private readonly jobService: JobService,
		private readonly nodemailerService: NodemailerService,
		private readonly templateService: TemplateService,
		private readonly appService: AppService
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
			const app = await this.appService.httpBasicApplication({ appId: props.appId }, uid).then(async data => {
				await divineCatchWherer(['disable'].includes(data.status), { message: `应用已禁用` })
				await divineCatchWherer(['inactivated'].includes(data.status), { message: `应用未激活` })
				await divineCatchWherer(['delete'].includes(data.status), { message: `应用已删除` })
				return data
			})
			const sample = await this.templateService.httpBasicMailerTemplate({ id: props.sampleId }, uid).then(async data => {
				await divineCatchWherer(['disable'].includes(data.status), {
					message: `模板已禁用`
				})
				await divineCatchWherer(['pending', 'loading', 'rejected'].includes(data.status), {
					message: `模板未审核`
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
				total: 300,
				submit: 0,
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
						submit: data.submit, //提交队列数
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

	/**任务队列列表**/
	public async httpColumnSchedule(props: http.ColumnSchedule, uid: number) {
		return await this.RunCatch(async i18n => {
			const { total, list } = await this.batchValidator({
				model: this.entity.mailerSchedule,
				options: {
					join: {
						alias: 'tb',
						leftJoinAndSelect: {
							user: 'tb.user',
							app: 'tb.app',
							sample: 'tb.sample'
						}
					},
					where: new Brackets(qb => {
						qb.where('user.uid = :uid', { uid })
					}),
					order: { createTime: 'DESC' },
					skip: (props.page - 1) * props.size,
					take: props.size
				}
			})
			return await divineResult({ size: props.size, page: props.page, total, list })
		})
	}
}
