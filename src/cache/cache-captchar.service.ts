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
export class CacheAppwr extends CustomService {
	constructor(private readonly redisService: RedisService, private readonly dataBase: DataBaseService) {
		super()
	}

	/**缓存键**/
	public async cacheNameAppwr(appId: string) {
		return `:captchar:cache:appwr:${appId}`
	}

	/**读取应用缓存**/
	public async getAppwr(appId: string) {
		return await this.cacheNameAppwr(appId).then(async cacheName => {
			const cacheNode = await this.redisService.getStore<dataBase.TableCaptcharAppwr>(cacheName)
			if (isEmpty(cacheNode)) {
				return await this.validator(this.dataBase.tableCaptcharAppwr, {
					message: '应用不存在',
					join: { alias: 'tb' },
					where: new Brackets(qb => {
						qb.where('tb.appId = :appId', { appId })
						qb.andWhere('tb.status IN(:...status)', { status: ['activated', 'disable'] })
					})
				}).then(async data => {
					await this.setAppwr(appId, { ...data })
					return await divineResult({ ...data })
				})
			}
			return await divineResult({ ...cacheNode })
		})
	}

	/**写入应用缓存**/
	public async setAppwr(appId: string, data: Record<string, any>) {
		return await this.cacheNameAppwr(appId).then(async cacheName => {
			await this.redisService.setStore(cacheName, data)
			return await divineResult({ ...data })
		})
	}

	/**校验当前应用**/
	public async checkAppwr(appId: string, command: Array<string>) {
		return await this.getAppwr(appId).then(async data => {
			await divineCatchWherer(data.status === 'disable' && command.includes(data.status), {
				message: '应用已被禁用'
			})
			return await divineResult({ ...data })
		})
	}
}
