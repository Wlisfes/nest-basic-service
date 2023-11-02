import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigerModule } from '@/module/configer.module'
import { DatabaseModule } from '@/module/database.module'
import { ConfigService } from '@nestjs/config'
import { BullModule } from '@nestjs/bull'
import { AppController } from '@captchar-kueuer/app.controller'
import { AppService } from '@captchar-kueuer/app.service'
import { AppCaptcharKueuerConsumer } from '@captchar-kueuer/app.consumer'
import { TableCaptcharRecord } from '@/entity/tb-common.captchar__record'
import { customProvider } from '@/utils/utils-configer'
const configer = customProvider()

@Module({
	imports: [
		ConfigerModule,
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
		BullModule.registerQueue({
			name: configer.captchar.kueuer.name,
			defaultJobOptions: {
				removeOnComplete: JSON.parse(configer.captchar.kueuer.removeOnComplete || 'true'),
				removeOnFail: JSON.parse(configer.captchar.kueuer.removeOnFail || 'false')
			}
		}),
		DatabaseModule,
		TypeOrmModule.forFeature([TableCaptcharRecord])
	],
	controllers: [AppController],
	providers: [AppService, AppCaptcharKueuerConsumer]
})
export class AppModule {}
