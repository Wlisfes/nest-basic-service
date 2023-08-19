import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { Brackets } from 'typeorm'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import { divineHandler } from '@/utils/utils-common'

@Injectable()
export class ScheduleService extends CoreService {
	constructor(private readonly entity: EntityService) {
		super()
	}

	/**创建发送队列**/
	public async httpScheduleReducer() {
		return await this.RunCatch(async i18n => {
			return { message: '创建成功' }
		})
	}
}
