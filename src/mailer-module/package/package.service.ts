import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { Brackets, In } from 'typeorm'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import { UserService } from '@/user-module/user/user.service'
import { moment, divineResult, divineHandler, divineDeduction } from '@/utils/utils-common'
import * as http from '../interface/package.interface'

@Injectable()
export class MailerPackageService extends CoreService {
	constructor(private readonly entity: EntityService, private readonly userService: UserService) {
		super()
	}

	/**卖出套餐包**/
	private async sellMailerPackage(bundle: number) {
		return await this.RunCatch(async i18n => {
			return await this.validator({
				name: '套餐',
				model: this.entity.mailerPackage,
				empty: { value: true },
				options: {
					join: { alias: 'tb' },
					where: new Brackets(qb => {
						qb.where('tb.bundle = :bundle', { bundle })
					})
				}
			}).then(async data => {
				const surplus = data.surplus - 1
				if (surplus <= 0) {
					return await this.entity.mailerPackage.update({ bundle }, { surplus, status: 'soldout' })
				} else {
					return await this.entity.mailerPackage.update({ bundle }, { surplus })
				}
			})
		})
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
						qb.where('tb.bundle = :bundle', { bundle: props.bundle })
						qb.andWhere('tb.status IN(:...status)', { status: ['upper', 'under', 'expired', 'soldout'] })
					})
				}
			}).then(async data => {
				const expense = data.price - data.discount
				await divineHandler(data.status === 'under', () => {
					throw new HttpException('套餐已下架', HttpStatus.BAD_REQUEST)
				})
				await divineHandler(data.status === 'expired', () => {
					throw new HttpException('套餐已过期', HttpStatus.BAD_REQUEST)
				})
				await divineHandler(data.status === 'soldout' || data.surplus <= 0, () => {
					throw new HttpException('套餐已售罄', HttpStatus.BAD_REQUEST)
				})
				const { credit, balance, current } = await divineHandler(data.max > 0, async () => {
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
					return await this.userService.checkBalance(uid, expense)
				})
				const { orderId } = await this.userService.executeDeduction(uid, {
					credit: credit,
					balance: balance,
					cost: expense,
					name: data.name,
					bundle: data.bundle,
					type: 'email'
				})
				await this.sellMailerPackage(data.bundle)
				const userPackage = await this.entity.userMailerPackage.create({
					orderId: orderId,
					userId: uid,
					bundle: data.bundle,
					name: data.name,
					type: data.type,
					comment: data.comment,
					expire: data.expire,
					total: data.total,
					label: data.label,
					expense: expense,
					status: 'effect',
					expireTime: new Date(moment().add(data.expire, 'month').valueOf())
				})
				return await this.entity.userMailerPackage.save(userPackage)
			})
			return await divineResult({ message: '购买成功' })
		})
	}
}
