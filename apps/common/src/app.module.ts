import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { LoggerMiddleware } from '@/middleware/logger.middleware'
import { LoggerModule } from '@/module/logger.module'
import { ConfigerModule } from '@/module/configer.module'
import { CustomizeModule } from '@/module/customize.module'
import { DatabaseModule } from '@/module/database.module'
import { CacheModule } from '@/module/cache.module'
import { AppController } from '@common/app.controller'
import { AppService } from '@common/app.service'
import { CustomerModule } from '@common/customer/customer.module'
import { AliyunModule } from '@common/aliyun/aliyun.module'
import { custom } from '@/utils/utils-configer'

@Module({
	imports: [
		ClientsModule.register({
			isGlobal: true,
			clients: [
				{
					name: custom.captchar.instance.name,
					transport: Transport.TCP,
					options: { port: custom.captchar.port }
				}
			]
		}),
		LoggerModule.forRoot({ name: 'Common' }),
		ConfigerModule,
		CustomizeModule,
		DatabaseModule,
		CacheModule,
		CustomerModule,
		AliyunModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes('*')
	}
}
