import { Injectable, Inject } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { Brackets, Not } from 'typeorm'
import { CustomService } from '@/service/custom.service'
import { CacheCustomer } from '@/cache/cache-common.service'
import { CacheAppwr } from '@/cache/cache-captchar.service'
import { DataBaseService } from '@/service/database.service'
import { divineIntNumber, divineIntStringer, divineResult, divineWherer } from '@/utils/utils-common'
import { divineClientSender } from '@/utils/utils-plugin'
import { custom } from '@/utils/utils-configer'
import * as http from '@captchar/interface/appwr.resolver'

@Injectable()
export class AppwrService extends CustomService {
	constructor(
		private readonly cacheCustomer: CacheCustomer,
		private readonly cacheAppwr: CacheAppwr,
		private readonly dataBase: DataBaseService
	) {
		super()
	}

	/**创建应用**/
	public async httpCreateCaptcharAppwr(state: http.CreateCaptcharAppwr, uid: string) {
		//验证用户缓存
		await this.cacheCustomer.checkCache(uid, ['disable'])
		//验证重复性
		await this.customeRepeat(this.dataBase.tableCaptcharAppwr, {
			message: `${state.name}已存在`,
			join: { alias: 'tb' },
			where: new Brackets(qb => {
				qb.where('tb.uid = :uid', { uid })
				qb.andWhere('tb.name = :name', { name: state.name })
				qb.andWhere('tb.status != :status', { status: 'delete' })
			})
		})
		//查询应用数量
		const count = await this.dataBase.tableCaptcharAppwr.count({
			where: { uid, status: Not('delete') }
		})
		//写入表
		return await this.customeCreate(this.dataBase.tableCaptcharAppwr, {
			uid,
			name: state.name,
			status: 'activated',
			visible: count === 0,
			appId: await divineIntNumber(18),
			appSecret: await divineIntStringer(32)
		}).then(async data => {
			return await divineResult({ message: '创建成功' })
		})
	}

	/**编辑应用**/
	public async httpUpdateCaptcharAppwr(state: http.UpdateCaptcharAppwr, uid: string) {}

	/**应用列表**/
	public async httpColumnCaptcharAppwr(state: http.ColumnCaptcharAppwr, uid: string) {
		return await this.customeAndCountr(this.dataBase.tableCaptcharAppwr, {
			join: { alias: 'tb' },
			where: new Brackets(qb => {
				qb.where('tb.uid = :uid', { uid })
			}),
			order: { createTime: 'DESC' },
			skip: (state.page - 1) * state.size,
			take: state.size
		}).then(async ({ list, total }) => {
			return await divineResult({ total, list })
		})
	}
}
