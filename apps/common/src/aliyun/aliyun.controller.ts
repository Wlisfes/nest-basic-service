import { Controller, Post, Request } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { AliyunService } from '@common/aliyun/aliyun.service'
import { ApiDecorator } from '@/decorator/compute.decorator'
import * as dataBase from '@/entity'

@ApiTags('阿里云模块')
@Controller('aliyun')
export class AliyunController {
	constructor(private readonly aliyunService: AliyunService) {}

	@Post('/create/storage/authorize')
	@ApiDecorator({
		operation: { summary: '创建OSS-STS临时鉴权' },
		response: { status: 200, description: 'OK' },
		authorize: { login: true, error: true }
	})
	public async httpCreateStorageAuthorize(@Request() request: { user: dataBase.TableCustomer }) {
		return await this.aliyunService.httpCreateStorageAuthorize(request.user.uid)
	}
}
