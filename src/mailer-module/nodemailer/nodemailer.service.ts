import { Injectable } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'

@Injectable()
export class NodemailerService {
	constructor(private readonly mailerService: MailerService) {}

	/**自定义发送**/
	public async httpCustomizeNodemailer() {
		return await this.mailerService.sendMail({
			to: '876451336@qq.com', // List of receivers email address
			from: 'limvcfast@gmail.com', // Senders email address
			subject: 'Testing Nest MailerModule ✔', // Subject line
			text: 'welcome', // plaintext body
			html: '<b>Welcome</b>' // HTML body content
		})
	}
}
