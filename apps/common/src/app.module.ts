import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { LoggerMiddleware } from '@/middleware/logger.middleware'
import { LoggerModule } from '@/module/logger.module'
import { ConfigerModule } from '@/module/configer.module'
import { CustomizeModule } from '@/module/customize.module'
import { DatabaseModule } from '@/module/database.module'
import { AppController } from '@common/app.controller'
import { AppService } from '@common/app.service'
import { CustomerModule } from '@common/customer/customer.module'

@Module({
	imports: [LoggerModule.forRoot({ name: 'Common' }), ConfigerModule, CustomizeModule, DatabaseModule, CustomerModule],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes('*')
	}
}
