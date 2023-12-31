import { Injectable } from '@nestjs/common'
import { Brackets } from 'typeorm'
import { isEmpty } from 'class-validator'
import { CustomService } from '@/service/custom.service'
import { RedisService } from '@/service/redis.service'
import { DataBaseService } from '@/service/database.service'
import { divineResult } from '@/utils/utils-common'
import { divineCatchWherer } from '@/utils/utils-plugin'
import * as dataBase from '@/entity'

@Injectable()
export class CacheCustomer extends CustomService {
	constructor(private readonly redisService: RedisService, private readonly dataBase: DataBaseService) {
		super()
	}

	/**用户信息缓存键**/
	public async cacheNameCustomer(uid: string) {
		return `:common:cache:customer:resolver:${uid}`
	}

	/**用户配置缓存键**/
	public async cacheNameConfigur(uid: string) {
		return `:common:cache:customer:configur:${uid}`
	}

	/**读取用户信息缓存**/
	public async getCustomer(uid: string) {
		return await this.cacheNameCustomer(uid).then(async cacheName => {
			const cacheNode = await this.redisService.getStore<dataBase.TableCustomer>(cacheName)
			if (isEmpty(cacheNode)) {
				return await this.validator(this.dataBase.tableCustomer, {
					message: '账户不存在',
					join: { alias: 'tb' },
					where: new Brackets(qb => {
						qb.where('tb.uid = :uid', { uid })
						qb.andWhere('tb.status IN(:...status)', { status: ['enable', 'disable'] })
					})
				}).then(async data => {
					await this.setCustomer(uid, { ...data })
					return await divineResult({ ...data })
				})
			}
			return await divineResult({ ...cacheNode })
		})
	}

	/**读取用户配置缓存**/
	public async getConfigur(uid: string) {
		return await this.cacheNameConfigur(uid).then(async cacheName => {
			const cacheNode = await this.redisService.getStore<dataBase.TableCustomerConfigur>(cacheName)
			if (isEmpty(cacheNode)) {
				return await this.validator(this.dataBase.tableCustomerConfigur, {
					message: '账户不存在',
					join: { alias: 'tb' },
					where: new Brackets(qb => {
						qb.where('tb.uid = :uid', { uid })
					})
				}).then(async data => {
					await this.setConfigur(uid, { ...data })
					return await divineResult({ ...data })
				})
			}
			return await divineResult({ ...cacheNode })
		})
	}

	/**写入用户信息缓存**/
	public async setCustomer(uid: string, data: Record<string, any>) {
		return await this.cacheNameCustomer(uid).then(async cacheName => {
			await this.redisService.setStore(cacheName, data)
			return await divineResult({ ...data })
		})
	}

	/**写入用户配置缓存**/
	public async setConfigur(uid: string, data: Record<string, any>) {
		return await this.cacheNameConfigur(uid).then(async cacheName => {
			await this.redisService.setStore(cacheName, data)
			return await divineResult({ ...data })
		})
	}

	/**校验当前用户信息**/
	public async checkCustomer(uid: string, command: Array<string>) {
		return await this.getCustomer(uid).then(async data => {
			await divineCatchWherer(data.status === 'disable' && command.includes(data.status), {
				message: '账户已被禁用'
			})
			return await divineResult({ ...data })
		})
	}
}
