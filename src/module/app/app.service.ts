import { Injectable } from '@nestjs/common'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import * as httpApp from '@/interface/app.interface'

@Injectable()
export class AppService extends CoreService {
	constructor(private readonly entity: EntityService) {
		super()
	}

	/**创建应用**/
	public async httpCreateApp(props: httpApp.RequestCreateApp) {
		return await this.RunCatch(async i18n => {
			const node = await this.entity.appModel.create({
				uid: Date.now(),
				name: props.name,
				appKey: this.createCustomByte(18),
				appSecret: this.createCustomByte(64)
			})
			return await this.entity.appModel.save(node).then(async () => {
				return { message: '注册成功' }
			})
		})
	}
}
