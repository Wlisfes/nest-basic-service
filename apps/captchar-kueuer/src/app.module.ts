import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from '@/module/database/database.module'
import { ConfigService } from '@nestjs/config'
import { BullModule } from '@nestjs/bull'
import { AppController } from '@captchar-kueuer/app.controller'
import { AppService } from '@captchar-kueuer/app.service'
import { customProvider } from '@/utils/utils-configer'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			cache: true,
			load: [customProvider]
		}),
		BullModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				prefix: configService.get('redis.prefix'),
				redis: {
					host: configService.get('redis.host'),
					port: configService.get('redis.port'),
					password: configService.get('redis.password'),
					db: configService.get('redis.db')
				}
			})
		}),
		BullModule.registerQueueAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				name: configService.get('captchar.kueuer.name'),
				defaultJobOptions: {
					removeOnComplete: JSON.parse(configService.get('captchar.kueuer.removeOnComplete') || 'true'),
					removeOnFail: JSON.parse(configService.get('captchar.kueuer.removeOnFail') || 'false')
				}
			})
		}),
		DatabaseModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
