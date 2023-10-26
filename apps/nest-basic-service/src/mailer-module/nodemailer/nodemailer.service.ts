import { Injectable } from '@nestjs/common'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import { createNodemailer, customNodemailer, readNodemailer, NodemailerOption, CustomizeOption } from './nodemailer.provider'

interface CustomizeNodemailer extends NodemailerOption, CustomizeOption {
	appId: number
}

@Injectable()
export class NodemailerService extends CoreService {
	constructor(private readonly entity: EntityService) {
		super()
	}

	/**读取自定义模板**/
	public async readCustomize() {
		return await readNodemailer({ code: '896543' })
	}

	/**发送邮件**/
	public async httpCustomizeNodemailer(props: CustomizeNodemailer) {
		return await createNodemailer({
			host: props.host,
			port: props.port,
			secure: props.secure,
			user: props.user,
			password: props.password
		}).then(async transporter => {
			const html = await readNodemailer({ code: '896543' })
			return await customNodemailer(transporter, {
				from: props.from,
				to: props.to,
				subject: props.subject,
				html: html
			})
		})
	}
}
