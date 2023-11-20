import { Module, Global } from '@nestjs/common'
import { RedisService } from '@/service/redis.service'
import { CacheCustomer } from '@/cache/cache-customer.service'

@Global()
@Module({
	imports: [],
	providers: [RedisService, CacheCustomer],
	exports: [RedisService, CacheCustomer]
})
export class CacheModule {}
