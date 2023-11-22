import { Injectable } from '@nestjs/common'
import { Brackets } from 'typeorm'
import { isEmpty } from 'class-validator'
import { CustomService } from '@/service/custom.service'
import { RedisService } from '@/service/redis.service'
import { DataBaseService } from '@/service/database.service'
import { divineResult } from '@/utils/utils-common'
import { divineCatchWherer, divineCreateJwtToken, divineClientSender } from '@/utils/utils-plugin'
import * as dataBase from '@/entity'

@Injectable()
export class CacheCustomer extends CustomService {
	constructor(private readonly redisService: RedisService, private readonly dataBase: DataBaseService) {
		super()
	}

	/**缓存键**/
	public async cacheName(uid: string) {
		return `:common:cache:customer:${uid}`
	}

	/**读取用户缓存**/
	public async readCache(uid: string) {
		return await this.cacheName(uid).then(async cacheName => {
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
					await this.writeCache(uid, { ...data })
					return await divineResult({ ...data })
				})
			}
			return await divineResult({ ...cacheNode })
		})
	}

	/**写入用户缓存**/
	public async writeCache(uid: string, data: Record<string, any>) {
		return await this.cacheName(uid).then(async cacheName => {
			await this.redisService.setStore(cacheName, data)
			return await divineResult({ ...data })
		})
	}

	/**校验当前用户**/
	public async checkCache(uid: string, command: Array<string>) {
		return await this.readCache(uid).then(async data => {
			await divineCatchWherer(command.includes(data.status), {
				message: '账户已被禁用'
			})
			return await divineResult({ ...data })
		})
	}
}
