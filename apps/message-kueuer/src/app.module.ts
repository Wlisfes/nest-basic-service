import { Module } from '@nestjs/common'
import { LoggerModule } from '@/module/logger.module'
import { ConfigerModule } from '@/module/configer.module'
import { DatabaseModule } from '@/module/database.module'
import { BullModule } from '@nestjs/bull'
import { AppController } from '@message-kueuer/app.controller'
import { AppService } from '@message-kueuer/app.service'
import { custom } from '@/utils/utils-configer'

@Module({
	imports: [
		ConfigerModule,
		LoggerModule.forRoot({ name: 'Message-Kueuer' }),
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
			name: custom.message.kueuer.bull.name,
			defaultJobOptions: {
				removeOnComplete: custom.message.kueuer.bull.removeOnComplete,
				removeOnFail: custom.message.kueuer.bull.removeOnFail
			}
		}),
		DatabaseModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
