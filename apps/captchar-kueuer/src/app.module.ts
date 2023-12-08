import { Module } from '@nestjs/common'
import { LoggerModule } from '@/module/logger.module'
import { ConfigerModule } from '@/module/configer.module'
import { DatabaseModule } from '@/module/database.module'
import { BullModule } from '@nestjs/bull'
import { AppController } from '@captchar-kueuer/app.controller'
import { AppService } from '@captchar-kueuer/app.service'
import { AppCaptcharKueuerConsumer } from '@captchar-kueuer/app.consumer'
import { custom } from '@/utils/utils-configer'

@Module({
	imports: [
		ConfigerModule,
		LoggerModule.forRoot({ name: 'Captchar-Kueuer' }),
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
			name: custom.captchar.kueuer.bull.name,
			defaultJobOptions: {
				removeOnComplete: custom.captchar.kueuer.bull.removeOnComplete,
				removeOnFail: custom.captchar.kueuer.bull.removeOnFail
			}
		}),
		DatabaseModule
	],
	controllers: [AppController],
	providers: [AppService, AppCaptcharKueuerConsumer]
})
export class AppModule {}
