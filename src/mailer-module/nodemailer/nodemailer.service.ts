import { Injectable } from '@nestjs/common'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import { createNodemailer, customNodemailer, readNodemailer } from './nodemailer.provider'

@Injectable()
export class NodemailerService extends CoreService {
	constructor(private readonly entity: EntityService) {
		super()
	}

	/**读取自定义模板**/
	public async readCustomize() {}

	/**自定义发送**/
	public async httpCustomizeNodemailer() {
		const html = await readNodemailer({ code: '896543' })

		// return Buffer.from(html).toString('base64')
		// return html
		// return await createNodemailer({
		// 	host: 'smtp.qq.com',
		// 	port: 465,
		// 	secure: true,
		// 	user: '',
		// 	password: ''
		// }).then(async transporter => {
		// 	const html = await readNodemailer({ code: '896543' })
		// 	return await customNodemailer(transporter, {
		// 		from: '"妖雨纯" <>',
		// 		to: '',
		// 		subject: '温馨提示',
		// 		html: html
		// 	})
		// })
	}
}
