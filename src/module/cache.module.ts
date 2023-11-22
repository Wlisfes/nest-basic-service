import { Module, Global } from '@nestjs/common'
import { RedisService } from '@/service/redis.service'
import { CacheCustomer } from '@/cache/cache-common.service'
import { CacheAppwr } from '@/cache/cache-captchar.service'

@Global()
@Module({
	imports: [],
	providers: [RedisService, CacheCustomer, CacheAppwr],
	exports: [RedisService, CacheCustomer, CacheAppwr]
})
export class CacheModule {}
