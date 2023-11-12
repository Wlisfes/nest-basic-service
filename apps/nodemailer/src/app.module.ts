import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { LoggerMiddleware } from '@/middleware/logger.middleware'
import { LoggerModule } from '@/module/logger.module'
import { ConfigerModule } from '@/module/configer.module'
import { CustomizeModule } from '@/module/customize.module'
import { DatabaseModule } from '@/module/database.module'
import { AppController } from '@nodemailer/app.controller'
import { AppService } from '@nodemailer/app.service'
import { AppwrModule } from '@nodemailer/appwr/appwr.module'

@Module({
	imports: [LoggerModule.forRoot({ name: 'Nodemailer' }), ConfigerModule, CustomizeModule, DatabaseModule, AppwrModule],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes('*')
	}
}
