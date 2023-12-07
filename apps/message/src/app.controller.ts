import { Controller, Inject, Get } from '@nestjs/common'
import { ApiDecorator } from '@/decorator/compute.decorator'
import { UNI_CLIENT } from '@message-scheduler/uni.provider'
import { HttpService } from '@nestjs/axios'

@Controller()
export class AppController {
	constructor(@Inject(UNI_CLIENT) private readonly uniClient, private readonly httpService: HttpService) {}

	@Get('/authorize')
	@ApiDecorator({
		operation: { summary: '生成凭证' },
		response: { status: 200, description: 'OK' }
	})
	public async httpAuthorizeCaptcharReducer() {
		return await this.uniClient
			.send({
				to: '18676361342',
				signature: '音乐收藏',
				templateId: 'pub_verif_ttl3',
				templateData: { code: 9527, ttl: 15 }
			})
			.then(({ data }) => {
				console.log(data)
				return data
			})
	}
}
