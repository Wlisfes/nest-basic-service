import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import { divineHandler } from '@/utils/utils-common'
import * as http from '@/interface/supervisor.interface'

@Injectable()
export class SupervisorService extends CoreService {
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
				).then(e => e)
			})
			const requestId = await this.createUUIDRequest()
			const pinX = await this.createRandom(props.offset, props.width - props.offset - 20)
			const pinY = await this.createRandom(20, props.height - props.offset - 20)
			const node = await this.entity.recordModel.create({
				uid: Date.now(),
				width: props.width,
				height: props.height,
				offset: props.offset,
				referer,
				requestId,
				pinY,
				pinX,
				app
			})
			return await this.entity.recordModel.save(node).then(() => {
				return { requestId, pinX, pinY }
			})
		})
	}

	/**生成校验凭证**/
	public async httpAuthorize(props: http.RequestAuthorize, referer: string) {
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
			await this.validator({
				model: this.entity.recordModel,
				name: 'RequestID',
				empty: { value: true },
				options: { where: { requestId: props.requestId } }
			})
			const token = await this.aesEncrypt(
				{ referer, requestId: props.requestId, appKey: app.appKey },
				app.appSecret,
				app.appKey
			)
			return await this.entity.recordModel.update({ requestId: props.requestId }, { token }).then(e => {
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
					name: 'RequestID',
					empty: { value: true },
					options: { where: { requestId: props.requestId } }
				})
				return { message: '验证成功' }
			} catch (e) {}
		})
	}
}
