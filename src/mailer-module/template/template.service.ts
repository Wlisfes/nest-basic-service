import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { Brackets, In } from 'typeorm'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import { AliyunOssService } from '@/aliyun-module/aliyun-oss/aliyun-oss.service'
import { divineResult, divineHandler, divineWherer } from '@/utils/utils-common'
import * as mjml from 'mjml'
import * as http from '@/mailer-module/interface/template.interface'

@Injectable()
export class TemplateService extends CoreService {
	constructor(private readonly entity: EntityService, private readonly aliyunOssService: AliyunOssService) {
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
			return await this.entity.mailerTemplate.save(node).then(async () => {
				return await divineResult({ message: '创建成功' })
			})
		})
	}

	/**编辑邮件模板**/
	public async httpUpdateMailerTemplate(props: http.UpdateTemplate, uid: number) {
		return await this.RunCatch(async i18n => {
			await this.validator({
				model: this.entity.mailerTemplate,
				name: '模板',
				empty: { value: true },
				close: { value: true },
				delete: { value: true },
				options: {
					where: { id: props.id },
					relations: ['user']
				}
			}).then(async data => {
				await divineHandler(data.user.uid !== uid, () => {
					throw new HttpException(`模板不存在`, HttpStatus.BAD_REQUEST)
				})
				/**替换模板**/
				await divineHandler(Boolean(data.cover), async () => {
					return await this.aliyunOssService.deleteFiler(data.cover.replace(`https://oss.lisfes.cn/`, ''))
				})
				return data
			})
			await this.entity.mailerTemplate.update(
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
					where: { id: props.id },
					relations: ['user']
				}
			}).then(async data => {
				await divineHandler(data.user.uid !== uid, () => {
					throw new HttpException(`模板不存在`, HttpStatus.BAD_REQUEST)
				})
				return data
			})
		})
	}
}
