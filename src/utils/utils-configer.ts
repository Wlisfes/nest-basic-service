import * as fs from 'fs'
import * as yaml from 'js-yaml'
import * as path from 'path'

export enum CustomConfiger {
	development = 'development',
	production = 'production'
}

/**自定义注入配置**/
export function customProvider(): Record<string, any> {
	const env = process.env.NODE_ENV as keyof typeof CustomConfiger
	return yaml.load(fs.readFileSync(path.join(__dirname, `../../../${env}.yaml`), 'utf8'))
}
