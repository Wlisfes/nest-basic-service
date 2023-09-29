import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { Brackets, In } from 'typeorm'
import { CoreService } from '@/core/core.service'
import { RedisService } from '@/core/redis.service'
import { EntityService } from '@/core/entity.service'
import { AliyunOssService } from '@/aliyun-module/aliyun-oss/aliyun-oss.service'
import { divineResult, divineHandler, divineWherer } from '@/utils/utils-common'
import * as cache from '@/mailer-module/config/common-redis.resolver'
import * as http from '@/mailer-module/interface/template.interface'

@Injectable()
export class TemplateService extends CoreService {
	constructor(
		private readonly entity: EntityService,
		private readonly redisService: RedisService,
		private readonly aliyunOssService: AliyunOssService
	) {
		super()
	}

	/**创建邮件模板**/
	public async httpCreateMailerTemplate(props: http.CreateTemplate, uid: number) {
		return await this.RunCatch(async i18n => {
			const user = await this.validator({
				model: this.entity.user,
				name: '账号',
				empty: { value: true },
				close: { value: true },
				options: { where: { uid } }
			})
			const node = await this.entity.mailerTemplate.create({
				name: props.name,
				width: props.width,
				mjml: props.mjml,
				json: props.json,
				status: divineWherer(props.status === 'sketch', 'sketch', 'pending'),
				user
			})
			return await this.entity.mailerTemplate.save(node).then(async data => {
				/**模板创建成功后添加redis缓存**/
				await this.redisService.setStore(cache.createMailerTemplateCache(data.id), {
					id: data.id,
					name: data.name,
					cover: data.cover,
					width: data.width,
					status: data.status,
					mjml: data.mjml,
					userId: uid
				})
				return await divineResult({ message: '创建成功' })
			})
		})
	}

	/**编辑邮件模板**/
	public async httpUpdateMailerTemplate(props: http.UpdateTemplate, uid: number) {
		return await this.RunCatch(async i18n => {
			const sample = await this.validator({
				model: this.entity.mailerTemplate,
				name: '模板',
				empty: { value: true },
				close: { value: true },
				options: {
					join: {
						alias: 'tb',
						leftJoinAndSelect: { user: 'tb.user' }
					},
					where: new Brackets(qb => {
						qb.where('tb.id = :id', { id: props.id })
						qb.andWhere('tb.status IN(:...status)', { status: ['pending', 'loading', 'review', 'rejected', 'disable'] })
						qb.andWhere('user.uid = :uid', { uid })
					})
				}
			})
			await this.entity.mailerTemplate
				.update(
					{ id: props.id },
					{
						name: props.name,
						cover: props.cover,
						width: props.width,
						json: props.json,
						mjml: props.mjml,
						status: divineWherer(props.status === 'sketch', 'sketch', 'pending')
					}
				)
				.then(async () => {
					/**替换模板封面文件**/
					await divineHandler(Boolean(sample.cover), async () => {
						return await this.aliyunOssService.deleteFiler(sample.cover.replace(`https://oss.lisfes.cn/`, ''))
					})
					/**模板编辑成功后添加redis缓存**/
					const node = await this.redisService.getStore<typeof sample>(cache.createMailerTemplateCache(props.id))
					await this.redisService.setStore(
						cache.createMailerTemplateCache(props.id),
						Object.assign(node, {
							name: props.name,
							cover: props.cover,
							width: props.width,
							json: props.json,
							mjml: props.mjml,
							status: divineWherer(props.status === 'sketch', 'sketch', 'pending')
						})
					)
				})
			return await divineResult({ message: '编辑成功' })
		})
	}

	/**邮件模板列表**/
	public async httpColumnMailerTemplate(props: http.ColumnTemplate, uid: number) {
		return await this.RunCatch(async i18n => {
			const { list, total } = await this.batchValidator({
				model: this.entity.mailerTemplate,
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
			})
			return await divineResult({ list, total, size: props.size, page: props.page })
		})
	}

	/**邮件模板信息**/
	public async httpBasicMailerTemplate(props: http.BasicTemplate, uid: number) {
		return await this.RunCatch(async i18n => {
			return await this.validator({
				model: this.entity.mailerTemplate,
				name: '模板',
				empty: { value: true },
				options: {
					join: {
						alias: 'tb',
						leftJoinAndSelect: { user: 'tb.user' }
					},
					select: ['id', 'name', 'status', 'width', 'cover', 'createTime', 'updateTime', 'mjml', 'json', 'user'],
					where: new Brackets(qb => {
						qb.where('tb.id = :id', { id: props.id })
						qb.andWhere('tb.status IN(:...status)', { status: ['pending', 'loading', 'review', 'rejected', 'disable'] })
						qb.andWhere('user.uid = :uid', { uid })
					})
				}
			})
		})
	}
}
