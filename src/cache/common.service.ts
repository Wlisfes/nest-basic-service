import { Injectable } from '@nestjs/common'
import { RedisService } from '@/service/redis.service'
import * as cache from '@/utils/utils-cache'

@Injectable()
export class CommonCacheService {
	constructor(private readonly redisService: RedisService) {}

	public async httpCacheCustomer(uid: string) {
		try {
			const cacheName = cache.httpCommonCacheCustomer(uid)
			return await this.redisService.client.get(cacheName)
			// const node = await
		} catch (e) {}
	}
}
