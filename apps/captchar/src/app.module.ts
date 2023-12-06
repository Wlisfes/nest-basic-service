import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { LoggerMiddleware } from '@/middleware/logger.middleware'
import { LoggerModule } from '@/module/logger.module'
import { ConfigerModule } from '@/module/configer.module'
import { CustomizeModule } from '@/module/customize.module'
import { DatabaseModule } from '@/module/database.module'
import { CacheModule } from '@/module/cache.module'
import { AppController } from '@captchar/app.controller'
import { AppService } from '@captchar/app.service'
import { AppwrModule } from '@captchar/appwr/appwr.module'
import { BrowserModule } from '@captchar/browser/browser.module'

@Module({
	imports: [
		LoggerModule.forRoot({ name: 'Captchar' }),
		ConfigerModule,
		CustomizeModule,
		DatabaseModule,
		CacheModule,
		AppwrModule,
		BrowserModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes('*')
	}
}
