import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppwrController } from '@captchar/appwr/appwr.controller'
import { AppwrService } from '@captchar/appwr/appwr.service'
import { TableCustomer } from '@/entity/tb-common.customer'
import { TableCaptcharAppwr } from '@/entity/tb-common.captchar__appwr'

@Module({
	imports: [TypeOrmModule.forFeature([TableCustomer, TableCaptcharAppwr])],
	controllers: [AppwrController],
	providers: [AppwrService]
})
export class AppwrModule {}
