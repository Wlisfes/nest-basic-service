import { Controller, Get, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiDecorator } from '@/decorator/compute.decorator'
import { Notice } from '@/interface/common.interface'

@ApiTags('套餐包模块')
@Controller('package')
export class PackageController {
	@Post('/create/mailer')
	@ApiDecorator({
		operation: { summary: '创建邮件套餐包' },
		response: { status: 200, description: 'OK', type: Notice }
	})
	public async httpCreateMailerPackage() {
		// return await this.nodemailerService.httpCustomizeNodemailer()
	}
}
