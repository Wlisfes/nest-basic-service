import UniSMS from 'unisms'
import { custom } from '@/utils/utils-configer'
export const UNI_CLIENT = 'UNI_CLIENT'

/**创建Uni实例**/
export function createUniClientProvider() {
	return {
		provide: UNI_CLIENT,
		async useFactory() {
			return new UniSMS({
				accessKeyId: custom.message.provide.uni.accessKeyId
			})
		}
	}
}
