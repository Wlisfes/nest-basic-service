import { Module, Global } from '@nestjs/common'
import { RedisService } from '@/service/redis.service'
import { CommonCacheCustomerService } from '@/cache/common-customer.service'

@Global()
@Module({
	imports: [],
	providers: [RedisService, CommonCacheCustomerService],
	exports: [RedisService, CommonCacheCustomerService]
})
export class CacheModule {}
