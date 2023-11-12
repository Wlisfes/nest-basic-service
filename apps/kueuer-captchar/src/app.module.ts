import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigerModule } from '@/module/configer.module'
import { DatabaseModule } from '@/module/database.module'
import { BullModule } from '@nestjs/bull'
import { AppController } from '@kueuer-captchar/app.controller'
import { AppService } from '@kueuer-captchar/app.service'
import { AppCaptcharKueuerConsumer } from '@kueuer-captchar/app.consumer'
import { TableCaptcharRecord } from '@/entity/tb-common.captchar__record'
import { custom } from '@/utils/utils-configer'

@Module({
	imports: [
		ConfigerModule,
		BullModule.forRoot({
			prefix: custom.redis.prefix,
			redis: {
				host: custom.redis.host,
				port: custom.redis.port,
				password: custom.redis.password,
				db: custom.redis.db
			}
		}),
		BullModule.registerQueue({
			name: custom.captchar.kueuer.name,
			defaultJobOptions: {
				removeOnComplete: JSON.parse(custom.captchar.kueuer.removeOnComplete || 'true'),
				removeOnFail: JSON.parse(custom.captchar.kueuer.removeOnFail || 'false')
			}
		}),
		DatabaseModule,
		TypeOrmModule.forFeature([TableCaptcharRecord])
	],
	controllers: [AppController],
	providers: [AppService, AppCaptcharKueuerConsumer]
})
export class AppModule {}
