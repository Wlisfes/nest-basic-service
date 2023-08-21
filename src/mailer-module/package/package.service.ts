import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { Brackets, In } from 'typeorm'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import { UserService } from '@/user-module/user/user.service'
import { divineResult, divineHandler } from '@/utils/utils-common'
import * as http from '../interface/package.interface'

@Injectable()
export class MailerPackageService extends CoreService {
	constructor(private readonly entity: EntityService, private readonly userService: UserService) {
		super()
	}

	/**创建邮件套餐包**/
	public async httpCreateMailerPackage(props: http.CreateMailerPackage) {
		return await this.RunCatch(async i18n => {
			const node = await this.entity.mailerPackage.create({
				name: props.name,
				type: props.type,
				comment: props.comment ?? null,
				expire: props.expire,
				total: props.total,
				stock: props.stock,
				surplus: props.surplus,
				max: props.max,
				price: props.price,
				discount: props.discount,
				label: props.label ?? null,
				status: 'pending'
			})
			await this.entity.mailerPackage.save(node)
			return await divineResult({
				message: i18n.t('http.CREATE_SUCCESS')
			})
		})
	}

	/**邮件套餐包列表**/
	public async httpColumnMailerPackage(props: http.ColumnMailerPackage) {
		return await this.RunCatch(async i18n => {
			const { list, total } = await this.batchValidator({
				model: this.entity.mailerPackage,
				options: {
					join: { alias: 'tb' },
					where: new Brackets(qb => {
						qb.andWhere('tb.status IN(:...status)', { status: ['upper'] })
					}),
					order: { createTime: 'DESC' },
					skip: (props.page - 1) * props.size,
					take: props.size
				}
			})
			return await divineResult({
				list,
				total,
				page: props.page,
				size: props.size
			})
		})
	}

	/**购买邮件套餐包**/
	public async httpMailerPackageSubscriber(props: http.MailerPackageSubscriber, uid: number) {
		return await this.RunCatch(async i18n => {
			await this.validator({
				name: '套餐',
				model: this.entity.mailerPackage,
				empty: { value: true },
				options: {
					join: { alias: 'tb' },
					where: new Brackets(qb => {
						qb.where('tb.id = :id', { id: props.id })
						qb.andWhere('tb.status IN(:...status)', { status: ['upper', 'under', 'expired', 'soldout'] })
					})
				}
			}).then(async data => {
				const cost = data.price - data.discount
				await divineHandler(data.status === 'under', () => {
					throw new HttpException('套餐已下架', HttpStatus.BAD_REQUEST)
				})
				await divineHandler(data.status === 'expired', () => {
					throw new HttpException('套餐已过期', HttpStatus.BAD_REQUEST)
				})
				await divineHandler(data.status === 'soldout', () => {
					throw new HttpException('套餐已售罄', HttpStatus.BAD_REQUEST)
				})
				await divineHandler(data.max > 0, async () => {
					const [counts, count = 0] = await this.entity.userMailerPackage.findAndCount({
						where: {
							userId: uid,
							bundle: data.bundle,
							status: In(['effect', 'disable'])
						}
					})
					await divineHandler(count >= data.max, () => {
						throw new HttpException(`套餐限购${data.max}份`, HttpStatus.BAD_REQUEST)
					})
					const { credit, balance, current } = await this.userService.checkBalance(uid, cost)

					// await this.userService.executeDeduction()
				})

				const newPackage = await this.entity
				console.log(data)

				return data
			})
			return { message: '购买成功' }
		})
	}
}
