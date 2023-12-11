import * as fs from 'fs'
import * as yaml from 'js-yaml'
import * as path from 'path'
import * as ip from 'ip'

/**自定义注入配置**/
export function CustomProvider(): Record<string, any> {
	const ipv4 = ip.address()
	const configer = yaml.load(fs.readFileSync(path.join(__dirname, `../../../development.yaml`), 'utf8'))
	return Object.assign({ ipv4 }, configer)
}

/**自定义配置导出**/
export const custom = CustomProvider()
