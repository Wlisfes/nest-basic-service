import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CustomerController } from '@common/customer/customer.controller'
import { CustomerService } from '@common/customer/customer.service'
import { TableCustomer } from '@/entity/tb-common.customer'
import { TableCustomerConfigur } from '@/entity/tb-common.customer__configur'

@Module({
	imports: [TypeOrmModule.forFeature([TableCustomer, TableCustomerConfigur]), HttpModule],
	controllers: [CustomerController],
	providers: [CustomerService]
})
export class CustomerModule {}
