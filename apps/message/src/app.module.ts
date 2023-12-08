import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { LoggerMiddleware } from '@/middleware/logger.middleware'
import { LoggerModule } from '@/module/logger.module'
import { ConfigerModule } from '@/module/configer.module'
import { CustomizeModule } from '@/module/customize.module'
import { DatabaseModule } from '@/module/database.module'
import { CacheModule } from '@/module/cache.module'
import { CustomerModule } from '@common/customer/customer.module'
import { AliyunModule } from '@common/aliyun/aliyun.module'
import { AppController } from '@message/app.controller'
import { AppService } from '@message/app.service'
import { createUniClientProvider } from '@message-scheduler/uni.provider'

@Module({
	imports: [
		LoggerModule.forRoot({ name: 'Message' }),
		HttpModule,
		ConfigerModule,
		CustomizeModule,
		DatabaseModule,
		CacheModule,
		CustomerModule,
		AliyunModule
	],
	controllers: [AppController],
	providers: [createUniClientProvider(), AppService]
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes('*')
	}
}
