import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { CustomerController } from '@common/customer/customer.controller'
import { CustomerService } from '@common/customer/customer.service'

@Module({
	imports: [HttpModule],
	controllers: [CustomerController],
	providers: [CustomerService]
})
export class CustomerModule {}
