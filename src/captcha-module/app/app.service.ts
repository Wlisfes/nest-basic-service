import { Injectable } from '@nestjs/common'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import * as http from '../interface/app.interface'

@Injectable()
export class AppService extends CoreService {
	constructor(private readonly entity: EntityService) {
		super()
	}

	/**创建应用**/
	public async httpCreateApplication(props: http.CreateApplication) {
		return await this.RunCatch(async i18n => {
			const node = await this.entity.captchaApplication.create({
				appId: await this.createCustomUidByte(),
				name: props.name,
				appKey: await this.createCustomByte(16),
				appSecret: await this.createCustomByte(32)
			})
			return await this.entity.captchaApplication.save(node).then(async () => {
				return { message: '注册成功' }
			})
		})
	}

	/**编辑授权地址**/
	public async httpUpdateBucket(props: http.UpdateBucket) {
		return await this.RunCatch(async i18n => {
			await this.validator({
				model: this.entity.captchaApplication,
				name: '应用',
				empty: { value: true },
				close: { value: true },
				options: { where: { appKey: props.appKey } }
			})
			return await this.entity.captchaApplication
				.update({ appKey: props.appKey }, { bucket: props.bucket, ip: props.ip })
				.then(() => {
					return { message: '编辑成功' }
				})
		})
	}

	/**应用信息**/
	public async httpBasicApp(props: http.BasicApplication) {
		return await this.RunCatch(async i18n => {
			return await this.validator({
				model: this.entity.captchaApplication,
				name: '应用',
				empty: { value: true },
				options: { where: { appKey: props.appKey } }
			})
		})
	}
}
