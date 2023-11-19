import { custom } from '@/utils/utils-configer'
import * as Client from 'ali-oss'
export const OSS_CLIENT = Symbol('OSS_CLIENT')
export const OSS_STS_CLIENT = Symbol('OSS_STS_CLIENT')

export function createOssProvider() {
	return {
		provide: OSS_CLIENT,
		useFactory: () => {
			return new Client({
				region: custom.aliyun.oss.region,
				endpoint: custom.aliyun.oss.endpoint,
				accessKeyId: custom.aliyun.oss.accessKeyId,
				accessKeySecret: custom.aliyun.oss.accessKeySecret,
				bucket: custom.aliyun.oss.bucket,
				timeout: custom.aliyun.oss.timeout,
				internal: custom.aliyun.oss.internal,
				secure: custom.aliyun.oss.secure,
				cname: custom.aliyun.oss.cname
			})
		}
	}
}

export function createOssSTSProvider() {
	return {
		provide: OSS_STS_CLIENT,
		useFactory: () => {
			return new Client.STS({
				accessKeyId: custom.aliyun.oss.accessKeyId,
				accessKeySecret: custom.aliyun.oss.accessKeySecret
			})
		}
	}
}
