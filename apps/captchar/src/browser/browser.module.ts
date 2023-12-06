import { Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bull'
import { BrowserController } from '@captchar/browser/browser.controller'
import { BrowserService } from '@captchar/browser/browser.service'
import { custom } from '@/utils/utils-configer'

@Module({
	imports: [
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
		})
	],
	controllers: [BrowserController],
	providers: [BrowserService]
})
export class BrowserModule {}
