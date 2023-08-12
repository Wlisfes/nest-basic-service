import { Injectable } from '@nestjs/common'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import * as http from '../interface/user.interface'

@Injectable()
export class UserService extends CoreService {
	constructor(private readonly entity: EntityService) {
		super()
	}

	/**注册用户**/
	public async httpRegister(props: http.Register) {
		return await this.RunCatch(async i18n => {
			const node = await this.entity.user.create({
				uid: Date.now(),
				nickname: props.nickname,
				password: props.password
			})
			return await this.entity.user.save(node).then(async () => {
				return { message: '注册成功' }
			})
		})
	}
}
