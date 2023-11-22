import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { Repository, FindOneOptions, FindConditions, FindManyOptions, DeepPartial, SelectQueryBuilder } from 'typeorm'
import { divineCatchWherer } from '@/utils/utils-plugin'
import { divineResult } from '@/utils/utils-common'

@Injectable()
export class CustomService {
	/**验证数据模型是否存在**/
	public async validator<T>(model: Repository<T>, state: FindOneOptions<T> & Partial<{ message: string; code: number }>) {
		try {
			const node = await model.findOne(state)
			await divineCatchWherer(!node && Boolean(state.message), {
				message: state.message,
				code: state.code ?? HttpStatus.BAD_REQUEST
			})
			return await divineResult(node)
		} catch (e) {
			throw new HttpException(e.message, e.code)
		}
	}

	/**验证数据重复性**/
	public async customeRepeat<T>(model: Repository<T>, state: FindOneOptions<T> & Partial<{ message: string; code: number }>) {
		try {
			const node = await model.findOne(state)
			return await divineCatchWherer(node && Boolean(state.message), {
				message: state.message,
				code: state.code ?? HttpStatus.BAD_REQUEST
			})
		} catch (e) {
			throw new HttpException(e.message, e.code)
		}
	}

	/**创建数据模型**/
	public async customeCreate<T>(model: Repository<T>, state: DeepPartial<T>): Promise<T> {
		try {
			const node = await model.create(state)
			return model.save(node as typeof state)
		} catch (e) {
			throw new HttpException('服务器开小差了', HttpStatus.INTERNAL_SERVER_ERROR)
		}
	}

	/**更新数据模型**/
	public async customeUpdate<T>(model: Repository<T>, criter: FindConditions<T>, state: FindConditions<T>) {
		try {
			return await model.update(criter, state as never)
		} catch (e) {
			throw new HttpException('服务器开小差了', HttpStatus.INTERNAL_SERVER_ERROR)
		}
	}

	/**分页列表查询**/
	public async customeAndCountr<T>(model: Repository<T>, state: FindOneOptions<T> | FindManyOptions<T>) {
		try {
			return await model.findAndCount(state).then(async ([list = [], total = 0]) => {
				return await divineResult({ list, total })
			})
		} catch (e) {
			throw new HttpException(`服务器开小差了`, HttpStatus.INTERNAL_SERVER_ERROR)
		}
	}

	/**自定义查询**/
	public async customeBuilder<T, R>(model: Repository<T>, callback: (qb: SelectQueryBuilder<T>) => Promise<R>) {
		try {
			const qb = model.createQueryBuilder('tb')
			return await callback(qb)
		} catch (e) {
			throw new HttpException(`服务器开小差了`, HttpStatus.INTERNAL_SERVER_ERROR)
		}
	}
}
