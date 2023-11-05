import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppwrController } from '@nodemailer/appwr/appwr.controller'
import { AppwrService } from '@nodemailer/appwr/appwr.service'
import { TableCustomer } from '@/entity/tb-common.customer'
import { TableNodemailerAppwr } from '@/entity/tb-common.nodemailer__appwr'

@Module({
	imports: [TypeOrmModule.forFeature([TableCustomer, TableNodemailerAppwr])],
	controllers: [AppwrController],
	providers: [AppwrService]
})
export class AppwrModule {}
