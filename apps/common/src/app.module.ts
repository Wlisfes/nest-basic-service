import { Module } from '@nestjs/common'
import { ConfigerModule } from '@/module/configer/configer.module'
import { DatabaseModule } from '@/module/database/database.module'
import { AppController } from '@common/app.controller'
import { AppService } from '@common/app.service'
import { CustomerModule } from './customer/customer.module';

@Module({
	imports: [ConfigerModule, DatabaseModule, CustomerModule],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
