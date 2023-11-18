import { Injectable } from '@nestjs/common'
import { RedisService } from '@/service/redis.service'

@Injectable()
export class CommonCacheCustomerService {
	constructor(private readonly redisService: RedisService) {}

	/**缓存键**/
	public async createWriteName(uid: string) {
		return `:common:cache:customer:${uid}`
	}

	/**读取用户缓存**/
	public async readCustomer(uid: string) {
		return await this.createWriteName(uid).then(async cacheName => {
			return await this.redisService.getStore(cacheName)
		})
	}

	/**写入用户缓存**/
	public async writeCustomer(uid: string, data: any) {
		return await this.createWriteName(uid).then(async cacheName => {
			return await this.redisService.setStore(cacheName, data)
		})
	}
}
