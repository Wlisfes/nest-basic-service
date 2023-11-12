import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, Brackets } from 'typeorm'
import { CustomService } from '@/service/custom.service'
import { TableCaptcharAppwr } from '@/entity/tb-common.captchar__appwr'
import { TableCaptcharRecord } from '@/entity/tb-common.captchar__record'
import { divineIntNumber, divineResult } from '@/utils/utils-common'
import { divineCatchWherer, divineCreateJwtToken, divineParseJwtToken } from '@/utils/utils-plugin'
import { custom } from '@/utils/utils-configer'
import { firstValueFrom } from 'rxjs'
import * as http from '@captchar/interface/browser.resolver'

console.log(custom)

@Injectable()
export class BrowserService extends CustomService {
	constructor(
		@Inject(custom.captchar.kueuer.instance) private kueuer: ClientProxy,
		@InjectRepository(TableCaptcharAppwr) public readonly tableCaptcharAppwr: Repository<TableCaptcharAppwr>,
		@InjectRepository(TableCaptcharRecord) public readonly tableCaptcharRecord: Repository<TableCaptcharRecord>
	) {
		super()
	}

	/**生成校验凭证**/ //prettier-ignore
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
			const session = await divineIntNumber(32)
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
			}).then(async e => {
				return await firstValueFrom(this.kueuer.send({ cmd: 'create_job_reducer' }, {
					session,
					token,
					status: 'none'
				}))
			})
			return await divineResult({ session, token })
		})
	}

	/**校验凭证**/ //prettier-ignore
	public async httpAuthorizeChecker(state: http.AuthorizeChecker, referer: string) {
		try {
			await this.validator(this.tableCaptcharAppwr, {
				message: '应用不存在',
				join: { alias: 'tb' },
				where: new Brackets(qb => {
					qb.where('tb.appId = :appId', { appId: state.appId })
					qb.andWhere('tb.status IN(:...status)', { status: ['activated', 'disable'] })
				})
			}).then(async data => {
				return await divineCatchWherer(data.status === 'disable', {
					message: '应用已被禁用'
				})
			})
			await this.validator(this.tableCaptcharRecord, {
				message: 'token记录不存在',
				join: { alias: 'tb' },
				where: new Brackets(qb => {
					qb.where('tb.session = :session', { session: state.session })
				})
			}).then(async data => {
				await divineCatchWherer(['success', 'failure', 'invalid'].includes(data.status), {
					message: 'token凭证已失效'
				})
				return data
			})
			try {
				return await divineParseJwtToken(state.token, {
					secret: state.appSecret,
					code: HttpStatus.BAD_REQUEST
				}).then(async jt => {
					await divineCatchWherer(jt.session !== state.session, {
						message: 'token验证失败'
					})
					await firstValueFrom(this.kueuer.send({ cmd: 'update_job_reducer' }, {
						jobId: state.session,
						option: { status: 'success' }
					})).then(async e => {
						return await this.customeUpdate(this.tableCaptcharRecord,
							{ session: state.session },
							{ status: 'success' }
						)
					})
					return await divineResult({ check: true })
				})
			} catch (e) {
				await firstValueFrom(this.kueuer.send({ cmd: 'update_job_reducer' }, {
					jobId: state.session,
					option: { status: 'failure' }
				})).then(async e => {
					return await this.customeUpdate(this.tableCaptcharRecord,
						{ session: state.session },
						{ status: 'failure' }
					)
				})
				throw new HttpException(e.message, e.status)
			}
		} catch (e) {
			throw new HttpException(e.message, e.status)
		}
	}
}
