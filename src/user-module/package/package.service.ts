import { Injectable } from '@nestjs/common'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'

@Injectable()
export class PackageService extends CoreService {
	constructor(private readonly entity: EntityService) {
		super()
	}

	/**创建邮件套餐包**/
	public async httpCreateMailerPackage() {}
}
