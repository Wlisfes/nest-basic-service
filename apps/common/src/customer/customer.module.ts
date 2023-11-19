import { Module } from '@nestjs/common'
import { CustomerController } from '@common/customer/customer.controller'
import { CustomerService } from '@common/customer/customer.service'

@Module({
	imports: [],
	controllers: [CustomerController],
	providers: [CustomerService]
})
export class CustomerModule {}
