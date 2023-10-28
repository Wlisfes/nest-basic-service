import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { Repository, FindOneOptions } from 'typeorm'
import { divineCatchWherer } from '@/utils/utils-plugin'
import { divineResult } from '@/utils/utils-common'

@Injectable()
export class CustomService {
	/**验证数据模型是否存在**/
	public async validator<T>(model: Repository<T>, state: FindOneOptions<T> & Partial<{ message: string; code: number }>) {
		try {
			const node = model.findOne(state)
			await divineCatchWherer(!!node && !!state.message, {
				message: state.message ?? '服务器开小差了',
				code: state.code ?? (state.message ? HttpStatus.BAD_REQUEST : HttpStatus.INTERNAL_SERVER_ERROR)
			})
			return await divineResult(node)
		} catch (e) {
			throw new HttpException(e.message, e.code)
		}
	}
}
