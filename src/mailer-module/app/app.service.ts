import { Injectable } from '@nestjs/common'
import { Brackets } from 'typeorm'
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
			const random = (await this.createRandom(11111, 99999)).toString()
			const node = await this.entity.mailerApplication.create({
				uid: Number(Date.now() + random),
				name: props.name,
				appKey: await this.createCustomByte(16),
				appSecret: await this.createCustomByte(32)
			})
			return await this.entity.mailerApplication.save(node).then(async () => {
				return { message: '注册成功' }
			})
		})
	}

	/**编辑授权地址**/
	public async httpUpdateBucket(props: http.UpdateBucket) {
		return await this.RunCatch(async i18n => {
			await this.validator({
				model: this.entity.mailerApplication,
				name: '应用',
				empty: { value: true },
				close: { value: true },
				options: { where: { appKey: props.appKey } }
			})
			return await this.entity.mailerApplication.update({ appKey: props.appKey }, { bucket: props.bucket, ip: props.ip }).then(() => {
				return { message: '编辑成功' }
			})
		})
	}

	/**应用列表**/
	public async httpColumnApplication(props: http.ColumnApplication, uid: number) {
		return await this.RunCatch(async i18n => {
			console.log(uid)
			return await this.batchValidator({
				model: this.entity.mailerApplication,
				options: {
					join: {
						alias: 'tb',
						leftJoinAndSelect: { user: 'tb.user' }
					},
					where: new Brackets(qb => {
						qb.where('user.uid = :uid', { uid })
					}),
					order: { createTime: 'DESC' },
					skip: (props.page - 1) * props.size,
					take: props.size
				}
			}).then(({ list, total }) => {
				return { size: props.size, page: props.page, total, list }
			})
		})
	}

	/**应用信息**/
	public async httpBasicApplication(props: http.BasicApplication) {
		return await this.RunCatch(async i18n => {
			return await this.validator({
				model: this.entity.mailerApplication,
				name: '应用',
				empty: { value: true },
				options: { where: { appKey: props.appKey } }
			})
		})
	}
}
