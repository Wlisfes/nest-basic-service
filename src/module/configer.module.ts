import { Module, Global } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { RedisModule } from '@liaoliaots/nestjs-redis'
import { JwtModule } from '@nestjs/jwt'
import { RedisService } from '@/service/redis.service'
import { CustomProvider, custom } from '@/utils/utils-configer'

@Global()
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			cache: true,
			load: [CustomProvider]
		}),
		RedisModule.forRoot({
			readyLog: true,
			config: {
				keyPrefix: custom.redis.prefix,
				host: custom.redis.host,
				port: custom.redis.port,
				password: custom.redis.password,
				db: custom.redis.db
			}
		}),
		JwtModule
	],
	controllers: [],
	providers: [RedisService],
	exports: [RedisService]
})
export class ConfigerModule {}
