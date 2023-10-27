import { Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CustomerService } from '@common/customer/customer.service'
import { ApiDecorator } from '@/decorator/compute.decorator'
import { NoticeResolver } from '@/interface/common.resolver'

@ApiTags('用户模块')
@Controller('customer')
export class CustomerController {
	constructor(private readonly customerService: CustomerService) {}

	@Post('/register')
	@ApiDecorator({
		operation: { summary: '注册用户' },
		response: { status: 200, description: 'OK', type: NoticeResolver }
	})
	public async httpRegister() {
		return await this.customerService.httpRegister()
	}
}
