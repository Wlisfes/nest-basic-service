import { ConfigService } from '@nestjs/config'
import * as Client from 'ali-oss'
export const OSS_CLIENT = Symbol('OSS_CLIENT')
export const OSS_STS_CLIENT = Symbol('OSS_CLIENT')

export function createOssProvider() {
	return {
		provide: OSS_CLIENT,
		inject: [ConfigService],
		useFactory: function ossProvider(config: ConfigService) {
			return new Client({
				endpoint: config.get('OSS_ENDPOINT'),
				accessKeyId: config.get('OSS_ACCESSKEYID'),
				accessKeySecret: config.get('OSS_ACCESSKEYSECRET'),
				bucket: config.get('OSS_BUCKET'),
				timeout: 60000,
				internal: false,
				secure: true,
				cname: true
			})
		}
	}
}

export function createOssSTSProvider() {
	return {
		provide: OSS_STS_CLIENT,
		inject: [ConfigService],
		useFactory: function ossSTSProvider(config: ConfigService) {
			return new Client.STS({
				accessKeyId: config.get('OSS_ACCESSKEYID'),
				accessKeySecret: config.get('OSS_ACCESSKEYSECRET')
			})
		}
	}
}
