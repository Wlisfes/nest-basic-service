import { Injectable } from '@nestjs/common'

const nodemailer = require('nodemailer')

@Injectable()
export class NodemailerService {
	/**自定义发送**/
	public async httpCustomizeNodemailer() {
		let mailOptions = {
			from: 'limvcfast@gmail.com',
			to: '876451336@qq.com',
			subject: '温馨提示',
			text: 'That was easy!',
			html: `欢迎注册情雨随风的妖雨录, 您的验证码是: <b>123456</b> 有效时间30分钟`
		}

		// const transporter = nodemailer.createTransport({
		// 	host: 'smtp.gmail.com',
		// 	port: 587,
		// 	secure: false,
		// 	requireTLS: true,
		// 	auth: {
		// 		user: '',
		// 		pass: ''
		// 	}
		// })
		// transporter.sendMail(mailOptions, function (error, info) {
		// 	if (error) {
		// 		console.log(error)
		// 	} else {
		// 		console.log('Email sent: ' + info.response)
		// 	}
		// })
	}
}
