import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { Brackets } from 'typeorm'
import { Job } from 'bull'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import { JobService } from '@/job-module/job.service'
import { divineHandler } from '@/utils/utils-common'
import { JOB_SUPERVISOR } from '@/config/job-config'
import * as http from '../interface/supervisor.interface'

@Injectable()
export class SupervisorService extends CoreService {
	constructor(private readonly entity: EntityService, private readonly job: JobService) {
		super()
	}

	/**注册验证码配置**/
	public async httpReducer(props: http.Reducer, referer: string) {
		return await this.RunCatch(async i18n => {
			const app = await this.validator({
				model: this.entity.captchaApplication,
				name: '应用',
				empty: { value: true },
				close: { value: true },
				options: { where: { appKey: props.appKey }, relations: ['user'] }
			}).then(async data => {
				return await divineHandler(
					() => !(data.bucket.includes('*') || data.bucket.includes(referer)),
					() => {
						throw new HttpException('地址未授权', HttpStatus.BAD_REQUEST)
					}
				).then(e => data)
			})
			const session = (await this.createCustomByte()).toUpperCase()
			const pinX = await this.createRandom(props.offset, props.width - props.offset - 20)
			const pinY = await this.createRandom(20, props.height - props.offset - 20)
			const job = await this.job.supervisor.add({ session, check: 'NODE' }, { delay: JOB_SUPERVISOR.delay })
			const node = await this.entity.captchaRecord.create({
				uid: Date.now(),
				width: props.width,
				height: props.height,
				offset: props.offset,
				jobId: job.id as number,
				user: app.user || null,
				app,
				session,
				referer,
				pinY,
				pinX
			})
			return await this.entity.captchaRecord.save(node).then(e => {
				return { session, pinX, pinY }
			})
		})
	}

	/**生成校验凭证**/
	public async httpAuthorize(props: http.Authorize, referer: string) {
		return await this.RunCatch(async i18n => {
			const { appKey, appSecret } = await this.validator({
				model: this.entity.captchaApplication,
				name: '应用',
				empty: { value: true },
				close: { value: true },
				options: { where: { appKey: props.appKey } }
			}).then(async data => {
				return await divineHandler(
					() => !(data.bucket.includes('*') || data.bucket.includes(referer)),
					() => {
						throw new HttpException('地址未授权', HttpStatus.BAD_REQUEST)
					}
				).then(e => data)
			})
			const { jobId, session } = await this.validator({
				model: this.entity.captchaRecord,
				name: 'session记录',
				empty: { value: true },
				options: { where: { session: props.session } }
			})
			return await this.job.supervisor.getJob(jobId).then(async job => {
				if (!job || job.data.check === 'INVALID') {
					throw new HttpException('session记录已失效', HttpStatus.BAD_REQUEST)
				} else {
					const token = await this.aesEncrypt({ referer, session, appKey }, appSecret, appKey)
					await this.entity.captchaRecord.update({ session }, { token })
					await job.update({ ...job.data, token })
					return { token }
				}
			})
		})
	}

	/**校验凭证**/
	public async httpInspector(props: http.Inspector, referer: string) {
		return await this.RunCatch(async i18n => {
			await this.validator({
				model: this.entity.captchaApplication,
				name: '应用',
				empty: { value: true, message: 'appKey、appSecret错误' },
				close: { value: true },
				options: { where: { appKey: props.appKey, appSecret: props.appSecret } }
			}).then(async data => {
				return await divineHandler(
					() => !(data.bucket.includes('*') || data.bucket.includes(referer)),
					() => {
						throw new HttpException('地址未授权', HttpStatus.BAD_REQUEST)
					}
				).then(e => data)
			})
			const { jobId, session } = await this.validator({
				model: this.entity.captchaRecord,
				name: 'session记录',
				empty: { value: true },
				options: { where: { session: props.session } }
			}).then(async data => {
				return await divineHandler(
					e => props.token !== data.token,
					e => {
						throw new HttpException('token错误', HttpStatus.BAD_REQUEST)
					}
				).then(e => data)
			})
			return await this.job.supervisor
				.getJob(jobId)
				.then(async (job: Job<{ session: string; check: string }>) => {
					if (!job || job.data.check === 'INVALID') {
						throw new HttpException('session记录已失效', HttpStatus.BAD_REQUEST)
					} else {
						await this.entity.captchaRecord.update({ session }, { check: 'SUCCESS' })
						await job.update({ ...job.data, check: 'SUCCESS' })
						await job.promote()
					}
					return { message: '验证成功' }
				})
		})
	}

	/**校验记录**/
	public async httpColumnSupervisor(props: http.ColumnSupervisor) {
		return await this.RunCatch(async i18n => {
			const [list = [], total = 0] = await this.entity.captchaRecord
				.createQueryBuilder('t')
				.where(new Brackets(Q => {}))
				.orderBy({ 't.createTime': 'DESC' })
				.skip((props.page - 1) * props.size)
				.take(props.size)
				.getManyAndCount()

			return { size: props.size, page: props.page, total, list }
		})
	}
}
