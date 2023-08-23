const nodemailer = require('nodemailer')
import * as handlebar from 'handlebars'
import * as mjml from 'mjml'
import * as fs from 'fs'
import * as path from 'path'

export interface NodemailerOption {
	host: string
	port: number
	secure: boolean
	user: string
	password: string
}
export interface CustomizeOption {
	from: string
	to: string
	subject: string
	html: string
}

export async function createNodemailer(option: NodemailerOption) {
	return new nodemailer.createTransport({
		host: option.host,
		port: option.port,
		secure: option.secure ?? true,
		auth: {
			user: option.user,
			pass: option.password
		}
	})
}

export function customNodemailer(transporter: any, mailOption: CustomizeOption) {
	return new Promise((resolve, reject) => {
		return transporter.sendMail(mailOption, (error, info) => {
			if (error) {
				reject(error)
			} else {
				resolve(info)
			}
			return transporter.close()
		})
	})
}

/**读取自定义模板**/
export async function readNodemailer(option: Record<string, any> = {}) {
	// return fs.readFileSync(path.join(process.cwd(), './public/template/index.html'), 'utf8')
	const register = handlebar.compile(fs.readFileSync(path.join(process.cwd(), './public/template/test.mjml'), 'utf8'))
	return mjml(register(option)).html
}
