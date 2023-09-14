import { Injectable, Inject } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import { OSS_CLIENT, OSS_STS_CLIENT } from './aliyun-oss.provider'
import { divineResult, divineHandler } from '@/utils/utils-common'
import * as Client from 'ali-oss'

@Injectable()
export class AliyunOssService extends CoreService {
	constructor(
		@Inject(OSS_CLIENT) protected readonly client: Client,
		@Inject(OSS_STS_CLIENT) protected readonly stsClient: Client.STS,
		private readonly configService: ConfigService,
		private readonly entity: EntityService
	) {
		super()
	}

	/**创建临时授权**/
	public async httpCreateAuthorize() {
		return await this.RunCatch(async i18n => {
			const { credentials } = await this.stsClient.assumeRole(
				this.configService.get('OSS_ROLEARN'),
				'',
				3600,
				this.configService.get('OSS_SESSIONNAME')
			)

			return await divineResult({
				token: credentials.SecurityToken
			})
		})
	}
}
