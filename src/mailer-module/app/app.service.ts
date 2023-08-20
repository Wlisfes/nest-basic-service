import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { Brackets } from 'typeorm'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import { divineHandler } from '@/utils/utils-common'
import * as http from '../interface/app.interface'

@Injectable()
export class AppService extends CoreService {
	constructor(private readonly entity: EntityService) {
		super()
	}

	/**创建应用**/
	public async httpCreateApplication(props: http.CreateApplication) {
		return await this.RunCatch(async i18n => {
			const node = await this.entity.mailerApplication.create({
				appId: await this.createCustomUidByte(),
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
			return await this.batchValidator({
				model: this.entity.mailerApplication,
				options: {
					join: {
						alias: 'tb',
						leftJoinAndSelect: {
							user: 'tb.user'
							// service: 'tb.service'
						}
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

	/**修改应用名称**/
	public async httpUpdateNameApplication(props: http.UpdateNameApplication, uid: number) {
		return await this.RunCatch(async i18n => {
			return await this.validator({
				model: this.entity.mailerApplication,
				name: '应用',
				empty: { value: true },
				options: {
					join: {
						alias: 'tb',
						leftJoinAndSelect: { user: 'tb.user' }
					},
					where: new Brackets(qb => {
						qb.where('tb.appKey = :appKey', { appKey: props.appKey })
						qb.andWhere('user.uid = :uid', { uid })
					})
				}
			}).then(async data => {
				await this.haveUpdate(
					{
						name: '应用',
						model: this.entity.mailerApplication,
						options: {
							join: {
								alias: 'tb',
								leftJoinAndSelect: { user: 'tb.user' }
							},
							where: new Brackets(qb => {
								qb.where('tb.name = :name', { name: props.name })
								qb.andWhere('user.uid = :uid', { uid })
							})
						}
					},
					node => node.appKey !== props.appKey
				)
				return await this.entity.mailerApplication.update({ appKey: data.appKey }, { name: props.name }).then(() => {
					return { message: '编辑成功' }
				})
			})
		})
	}

	/**重置appSecret**/
	public async httpResetMailerAppSecret(props: http.ResetMailerAppSecret, uid: number) {
		return await this.RunCatch(async i18n => {
			return await this.validator({
				model: this.entity.mailerApplication,
				name: '应用',
				empty: { value: true },
				options: {
					join: {
						alias: 'tb',
						leftJoinAndSelect: { user: 'tb.user' }
					},
					where: new Brackets(qb => {
						qb.where('tb.appKey = :appKey', { appKey: props.appKey })
						qb.andWhere('user.uid = :uid', { uid })
					})
				}
			}).then(async data => {
				return await this.entity.mailerApplication
					.update({ appKey: data.appKey }, { appSecret: await this.createCustomByte(32) })
					.then(() => {
						return { message: '重置成功' }
					})
			})
		})
	}

	/**添加、修改应用SMTP服务**/
	public async httpUpdateMailerService(props: http.UpdateMailerService, uid: number) {
		return await this.RunCatch(async i18n => {
			return await this.validator({
				model: this.entity.mailerApplication,
				name: '应用',
				empty: { value: true },
				options: {
					where: { appKey: props.appKey },
					relations: ['user', 'service']
				}
			}).then(async data => {
				await divineHandler(
					() => !data.user || data.user.uid !== uid,
					() => {
						throw new HttpException('appKey不存在', HttpStatus.BAD_REQUEST)
					}
				)
				if (data.service) {
					await this.entity.mailerService.update(
						{ id: data.service.id },
						{
							host: props.host ?? data.service.host,
							port: props.port ?? data.service.port,
							secure: props.secure ?? data.service.secure,
							username: props.username ?? data.service.username,
							password: props.password ?? data.service.password,
							type: props.type ?? data.service.type
						}
					)
					return await this.entity.mailerApplication.update({ id: data.id }, { status: 'activated' }).then(() => {
						return { message: '激活成功' }
					})
				}
				const node = await this.entity.mailerService.create({
					host: props.host,
					port: props.port,
					secure: props.secure,
					username: props.username,
					password: props.password,
					type: props.type,
					app: data,
					user: await this.entity.user.findOne({ where: { uid } })
				})
				await this.entity.mailerService.save(node)
				return await this.entity.mailerApplication.update({ id: data.id }, { status: 'activated' }).then(() => {
					return { message: '编辑成功' }
				})
			})
		})
	}
}
