import { Injectable } from '@nestjs/common'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'

@Injectable()
export class UserService extends CoreService {
	constructor(private readonly entity: EntityService) {
		super()
	}

	/**注册用户**/
	public async httpRegister(props: http.RequestRegister)  {
		
	}
}
