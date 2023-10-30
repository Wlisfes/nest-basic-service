import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Brackets } from 'typeorm'
import { CustomService } from '@/module/configer/custom.service'
import { TableCaptcharAppwr } from '@/entity/tb-common.captchar__appwr'
import { TableCaptcharRecord } from '@/entity/tb-common.captchar__record'
import { divineIntNumber, divineResult } from '@/utils/utils-common'
import { divineCatchWherer, divineCreateJwtToken, divineParseJwtToken } from '@/utils/utils-plugin'
import * as http from '@captchar/interface/browser.resolver'

@Injectable()
export class BrowserService extends CustomService {
	constructor(
		@InjectRepository(TableCaptcharAppwr) public readonly tableCaptcharAppwr: Repository<TableCaptcharAppwr>,
		@InjectRepository(TableCaptcharRecord) public readonly tableCaptcharRecord: Repository<TableCaptcharRecord>
	) {
		super()
	}

	/**生成校验凭证**/
	public async httpAuthorizeReducer(state: http.AuthorizeReducer, referer: string) {
		return await this.validator(this.tableCaptcharAppwr, {
			message: '应用不存在',
			join: {
				alias: 'tb',
				leftJoinAndSelect: { customer: 'tb.customer' }
			},
			where: new Brackets(qb => {
				qb.where('tb.appId = :appId', { appId: state.appId })
				qb.andWhere('tb.status IN(:...status)', { status: ['activated', 'disable'] })
			})
		}).then(async data => {
			await divineCatchWherer(data.status === 'disable', {
				message: '应用已被禁用'
			})
			const session = await divineIntNumber(22)
			const { token } = await divineCreateJwtToken({
				expire: 300,
				secret: data.appSecret,
				data: { session: session, appId: data.appId }
			})
			await this.customeCreate(this.tableCaptcharRecord, {
				appId: data.appId,
				appName: data.name,
				uid: data.customer.uid,
				nickname: data.customer.nickname,
				session: session,
				token: token,
				referer: referer,
				status: 'none'
			})
			return await divineResult({ session, token })
		})
	}

	/**校验凭证**/
	public async httpAuthorizeChecker(state: http.AuthorizeChecker, referer: string) {
		try {
			return await divineParseJwtToken(state.token, { secret: state.appSecret }).then(async ({ session, appId }) => {
				console.log({ session, appId })
				await this.validator(this.tableCaptcharRecord, {
					message: 'token记录不存在',
					join: { alias: 'tb' },
					where: new Brackets(qb => {
						qb.where('tb.session = :session', { session })
					})
				}).then(async data => {
					await divineCatchWherer(['success', 'failure', 'invalid'].includes(data.status), {
						message: 'token凭证已失效'
					})
				})

				return { session, appId }
			})
		} catch (e) {}

		// return await this.validator(this.tableCaptcharAppwr, {
		// 	message: '应用不存在',
		// 	where: new Brackets(qb => {
		// 		qb.where('tb.appId = :appId', { appId: state.appId })
		// 		qb.andWhere('tb.status IN(:...status)', { status: ['activated', 'disable'] })
		// 	})
		// }).then(async data => {
		// 	await divineCatchWherer(data.status === 'disable', {
		// 		message: '应用已被禁用'
		// 	})

		// 	return data
		// })
	}
}
