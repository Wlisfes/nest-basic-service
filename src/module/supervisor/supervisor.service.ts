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
			const requestId = this.createUUIDRequest()
			const pinX = this.createRandom(props.offset, props.width - props.offset - 20)
			const pinY = this.createRandom(20, props.height - props.offset - 20)
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
}
