import { Module } from '@nestjs/common'
import { ConfigerModule } from '@/module/configer.module'
import { CustomizeModule } from '@/module/customize.module'
import { DatabaseModule } from '@/module/database.module'
import { AppController } from '@common/app.controller'
import { AppService } from '@common/app.service'
import { CustomerModule } from '@common/customer/customer.module'

@Module({
	imports: [ConfigerModule, CustomizeModule, DatabaseModule, CustomerModule],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
