import { Module, Global } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { RedisModule } from '@liaoliaots/nestjs-redis'
import { JwtModule } from '@nestjs/jwt'
import { RedisService } from '@/service/redis.service'
import { customProvider } from '@/utils/utils-configer'

@Global()
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			cache: true,
			load: [customProvider]
		}),
		RedisModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				readyLog: true,
				config: {
					keyPrefix: configService.get('redis.prefix'),
					host: configService.get('redis.host'),
					port: configService.get('redis.port'),
					password: configService.get('redis.password'),
					db: configService.get('redis.db')
				}
			})
		}),
		JwtModule
	],
	controllers: [],
	providers: [RedisService],
	exports: [RedisService]
})
export class ConfigerModule {}
