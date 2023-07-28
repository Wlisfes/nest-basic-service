import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { Brackets, In } from 'typeorm'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import { divineHandler } from '@/utils/utils-common'
import * as http from '@/interface/supervisor.interface'

@Injectable()
export class SupervisorService extends CoreService {
	private readonly logger = new Logger(SupervisorService.name)
	constructor(private readonly entity: EntityService) {
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
			const node = await this.entity.recordModel.create({
				uid: Date.now(),
				width: props.width,
				height: props.height,
				offset: props.offset,
				session,
				referer,
				pinY,
				pinX,
				app
			})
			return await this.entity.recordModel.save(node).then(e => {
				console.log(e)
				this.logger.log(node)
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
				const u = await this.validator({
					model: this.entity.recordModel,
					name: 'session记录',
					empty: { value: true },
					options: { where: { session: props.session } }
				})
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
