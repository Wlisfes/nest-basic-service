import { Injectable } from '@nestjs/common'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import * as http from '@/interface/supervisor.interface'

@Injectable()
export class SupervisorService extends CoreService {
	constructor(private readonly entity: EntityService) {
		super()
	}

	/**注册验证码配置**/
	public async httpReducer(props: http.RequestReducer) {
		return await this.RunCatch(async i18n => {
			console.log(props)
			return {}
		})
	}
}
