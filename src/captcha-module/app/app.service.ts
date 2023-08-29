import { Injectable } from '@nestjs/common'
import { Brackets } from 'typeorm'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import { moment, divineResult, divineHandler } from '@/utils/utils-common'
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
				iv: await this.createCustomByte(16),
				appSecret: await this.createCustomByte(32)
			})
			await this.entity.captchaApplication.save(node)
			return await divineResult({ message: '注册成功' })
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
				options: { where: { appId: props.appId } }
			})
			await this.entity.captchaApplication.update({ appId: props.appId }, { bucket: props.bucket, ip: props.ip })
			return await divineResult({ message: '编辑成功' })
		})
	}

	/**应用列表**/
	public async httpColumnApplication(props: http.ColumnApplication, uid: number) {
		return await this.RunCatch(async i18n => {
			const { list, total } = await this.batchValidator({
				model: this.entity.mailerApplication,
				options: {
					join: {
						alias: 'tb',
						leftJoinAndSelect: {
							user: 'tb.user'
						}
					},
					where: new Brackets(qb => {
						qb.where('user.uid = :uid', { uid })
					}),
					order: { createTime: 'DESC' },
					skip: (props.page - 1) * props.size,
					take: props.size
				}
			})
			return await divineResult({
				size: props.size,
				page: props.page,
				total,
				list
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
				options: { where: { appId: props.appId } }
			})
		})
	}
}
