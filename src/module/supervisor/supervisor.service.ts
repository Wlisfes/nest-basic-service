import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { Brackets, In } from 'typeorm'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import { JobService } from '@/module/job/job.service'
import { divineHandler } from '@/utils/utils-common'
import * as http from '@/interface/supervisor.interface'

@Injectable()
export class SupervisorService extends CoreService {
	private readonly logger = new Logger(SupervisorService.name)
	constructor(private readonly entity: EntityService, private readonly job: JobService) {
		super()
	}

	/**注册验证码配置**/
	public async httpReducer(props: http.RequestReducer, referer: string) {
		return await this.RunCatch(async i18n => {
			const app = await this.validator({
				model: this.entity.appModel,
				name: '应用',
				empty: { value: true },
				close: { value: true },
				options: { where: { appKey: props.appKey } }
			}).then(async data => {
				return await divineHandler(
					e => !(data.bucket.includes('*') || data.bucket.includes(referer)),
					e => {
						throw new HttpException('地址未授权', HttpStatus.BAD_REQUEST)
					}
				).then(e => data)
			})

			const session = (await this.createCustomByte()).toUpperCase()
			const pinX = await this.createRandom(props.offset, props.width - props.offset - 20)
			const pinY = await this.createRandom(20, props.height - props.offset - 20)

			/**创建定时队列**/
			const job = await this.job.supervisor.add({ session }, { delay: 5 * 2 * 1000 })
			const node = await this.entity.recordModel.create({
				uid: Date.now(),
				width: props.width,
				height: props.height,
				offset: props.offset,
				jobId: job.id as number,
				session,
				referer,
				pinY,
				pinX,
				app
			})
			return await this.entity.recordModel.save(node).then(e => {
				return { session, pinX, pinY }
			})
		})
	}

	/**生成校验凭证**/
	public async httpAuthorize(props: http.RequestAuthorize, referer: string) {
		return await this.RunCatch(async i18n => {
			const { appKey, appSecret } = await this.validator({
				model: this.entity.appModel,
				name: '应用',
				empty: { value: true },
				close: { value: true },
				options: { where: { appKey: props.appKey } }
			}).then(async data => {
				return await divineHandler(
					e => !(data.bucket.includes('*') || data.bucket.includes(referer)),
					e => {
						throw new HttpException('地址未授权', HttpStatus.BAD_REQUEST)
					}
				).then(e => data)
			})
			const { session } = await this.validator({
				model: this.entity.recordModel,
				name: 'session记录',
				empty: { value: true },
				options: { where: { session: props.session } }
			})
			const token = await this.aesEncrypt({ referer, session, appKey }, appSecret, appKey)
			return await this.entity.recordModel.update({ session }, { token }).then(e => {
				return { token }
			})
		})
	}

	/**校验凭证**/
	public async httpInspector(props: http.RequestInspector, referer: string) {
		return await this.RunCatch(async i18n => {
			try {
				const app = await this.validator({
					model: this.entity.appModel,
					name: '应用',
					empty: { value: true },
					close: { value: true },
					options: { where: { appKey: props.appKey } }
				}).then(async data => {
					return await divineHandler(
						e => !(data.bucket.includes('*') || data.bucket.includes(referer)),
						e => {
							throw new HttpException('地址未授权', HttpStatus.BAD_REQUEST)
						}
					).then(e => data)
				})
				const { jobId } = await this.validator({
					model: this.entity.recordModel,
					name: 'session记录',
					empty: { value: true },
					options: { where: { session: props.session } }
				})
				const job = await this.job.supervisor.getJob(jobId)
				// await job.progress(100)
				// await job.remove()

				// await job.completed()

				return { message: '验证成功' }
			} catch (e) {}
		})
	}

	/**校验记录**/
	public async httpColumnSupervisor(props: http.RequestColumnSupervisor) {
		return await this.RunCatch(async i18n => {
			const [list = [], total = 0] = await this.entity.recordModel
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
