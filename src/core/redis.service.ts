import { Injectable } from '@nestjs/common'
import { InjectRedis, Redis } from '@nestjs-modules/ioredis'

@Injectable()
export class RedisService {
	constructor(@InjectRedis() private readonly client: Redis) {}

	/**redis存储**/
	public async setStore(key: string, data: any, seconds?: number) {
		if (!seconds) {
			return await this.client.set(key, JSON.stringify(data))
		} else {
			return await this.client.set(key, JSON.stringify(data), 'EX', seconds)
		}
	}

	/**redis读取**/
	public async getStore<T>(key: string, value?: T): Promise<T> {
		const data = await this.client.get(key)
		return data ? JSON.parse(data) : value ?? undefined
	}

	/**redis删除**/
	public async delStore(key: string) {
		return this.client.del(key)
	}
}
