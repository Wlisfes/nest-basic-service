import * as fs from 'fs'
import * as yaml from 'js-yaml'
import * as path from 'path'

export enum CustomConfiger {
	development = 'development',
	production = 'production'
}

/**自定义注入配置**/
export function CustomProvider(): Record<string, any> {
	const env = process.env.NODE_ENV.trim() as keyof typeof CustomConfiger
	return yaml.load(fs.readFileSync(path.join(__dirname, `../../../${env}.yaml`), 'utf8'))
}

/**自定义配置导出**/
export const custom = CustomProvider()
