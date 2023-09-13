import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as Client from 'ali-oss'

@Injectable()
export class AliyunOssService {
	private client: Client
	constructor(private readonly config: ConfigService) {
		this.client = new Client({
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
