import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ApiDecorator } from '@/decorator/compute.decorator'
import { ResultNotice } from '@/interface/common.interface'
import { NodemailerService } from './nodemailer.service'

@ApiTags('邮件服务模块')
@Controller('nodemailer')
export class NodemailerController {
	constructor(private readonly nodemailerService: NodemailerService) {}

	@Get('/create')
	@ApiDecorator({
		operation: { summary: '创建应用' },
		response: { status: 200, description: 'OK', type: ResultNotice }
	})
	public async httpCustomizeNodemailer() {
		return await this.nodemailerService.httpCustomizeNodemailer()
	}
}
