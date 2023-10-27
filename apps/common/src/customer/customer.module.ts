import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CustomerController } from '@common/customer/customer.controller'
import { CustomerService } from '@common/customer/customer.service'
import { TableCustomer } from '@/entity/tb-common.customer'

@Module({
	imports: [TypeOrmModule.forFeature([TableCustomer])],
	controllers: [CustomerController],
	providers: [CustomerService]
})
export class CustomerModule {}
