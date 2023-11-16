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
import { custom } from '@/utils/utils-configer'

@Module({
	imports: [
		ClientsModule.register({
			isGlobal: true,
			clients: [
				{
					name: 'COMMON_INSTANCE',
					transport: Transport.TCP,
					options: { port: custom.common.port }
				},
				{
					name: custom.captchar.kueuer.instance,
					transport: Transport.TCP,
					options: { port: custom.captchar.kueuer.port }
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
