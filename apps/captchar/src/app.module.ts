import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { LoggerMiddleware } from '@/middleware/logger.middleware'
import { LoggerModule } from '@/module/logger.module'
import { ConfigerModule } from '@/module/configer.module'
import { CustomizeModule } from '@/module/customize.module'
import { DatabaseModule } from '@/module/database.module'
import { AppController } from '@captchar/app.controller'
import { AppService } from '@captchar/app.service'
import { AppwrModule } from '@captchar/appwr/appwr.module'
import { BrowserModule } from '@captchar/browser/browser.module'
import { CustomProvider } from '@/utils/utils-configer'
const configer = CustomProvider()

@Module({
	imports: [
		ClientsModule.register({
			isGlobal: true,
			clients: [
				{
					name: 'CAPTCHAR_KUEUER',
					transport: Transport.TCP,
					options: { port: configer.kueuer.captchar.port }
				},
				{
					name: 'COMMON',
					transport: Transport.TCP,
					options: { port: configer.common.port }
				}
			]
		}),

		LoggerModule.forRoot({ name: 'Captchar' }),
		ConfigerModule,
		CustomizeModule,
		DatabaseModule,
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
