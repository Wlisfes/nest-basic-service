import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { Queue } from 'bull'
import { InjectQueue } from '@nestjs/bull'
import { Brackets } from 'typeorm'
import { CustomService } from '@/service/custom.service'
import { CacheAppwr } from '@/cache/cache-captchar.service'
import { DataBaseService } from '@/service/database.service'
import { divineIntNumber, divineResult } from '@/utils/utils-common'
import { divineCatchWherer, divineCreateJwtToken, divineParseJwtToken } from '@/utils/utils-plugin'
import { custom } from '@/utils/utils-configer'
import * as dataBase from '@/entity'
import * as http from '@captchar/interface/browser.resolver'

@Injectable()
export class BrowserService extends CustomService {
	constructor(
		private readonly cacheAppwr: CacheAppwr,
		private readonly dataBase: DataBaseService,
		@InjectQueue(custom.captchar.kueuer.bull.name) public readonly kueuer: Queue
	) {
		super()
	}

	/**生成校验凭证**/
	public async httpAuthorizeCaptcharReducer(state: http.AuthorizeCaptcharReducer, referer: string) {
		//验证应用缓存
		return await this.cacheAppwr.checkAppwr(state.appId, ['disable']).then(async data => {
			const session = await divineIntNumber(32)
			const { token } = await divineCreateJwtToken({
				expire: 300,
				secret: data.appSecret,
				data: { session: session, appId: data.appId }
			})
			//写入表
			await this.customeCreate(this.dataBase.tableCaptcharRecord, {
				appId: data.appId,
				uid: data.uid,
				session: session,
				token: token,
				referer: referer,
				status: 'none'
			}).then(async data => {
				//推入队列
				await this.kueuer.add(
					{
						session: data.session,
						token,
						status: 'none'
					},
					{ delay: custom.captchar.kueuer.bull.delay, jobId: data.session }
				)
			})
			return await divineResult({ session, token })
		})
	}

	/**校验凭证**/
	public async httpAuthorizeCaptcharChecker(state: http.AuthorizeCaptcharChecker, referer: string) {
		//验证应用缓存
		return await this.cacheAppwr.checkAppwr(state.appId, ['disable']).then(async data => {
			await this.validator(this.dataBase.tableCaptcharRecord, {
				message: 'token记录不存在',
				join: { alias: 'tb' },
				where: new Brackets(qb => {
					qb.where('tb.session = :session', { session: state.session })
				})
			}).then(async node => {
				await divineCatchWherer(['success', 'failure', 'invalid'].includes(node.status), {
					message: 'token凭证已失效'
				})
				return node
			})
			try {
				//解析token
				return await divineParseJwtToken(state.token, {
					secret: state.appSecret,
					code: HttpStatus.BAD_REQUEST
				}).then(async jt => {
					await divineCatchWherer(jt.session !== state.session, {
						message: 'token验证失败'
					})
					//更新队列数据
					await this.kueuer.getJob(state.session).then(async job => {
						return await job.update(Object.assign(job.data, { status: 'success' }))
					})
					//更新表数据
					return await this.customeUpdate(this.dataBase.tableCaptcharRecord, {
						condition: { session: state.session },
						state: { status: 'success' }
					}).then(async () => {
						return await divineResult({ check: true })
					})
				})
			} catch (e) {
				//更新队列数据
				await this.kueuer.getJob(state.session).then(async job => {
					return await job.update(Object.assign(job.data, { status: 'failure' }))
				})
				await this.customeUpdate(this.dataBase.tableCaptcharRecord, {
					condition: { session: state.session },
					state: { status: 'failure' }
				})
				throw new HttpException(e.message, e.status)
			}
		})
	}

	/**校验记录列表**/
	public async httpColumnCaptcharRecorder(state: http.ColumnCaptcharRecorder, uid: string) {
		return await this.customeBuilder(this.dataBase.tableCaptcharRecord, async qb => {
			qb.leftJoinAndMapOne('tb.customer', dataBase.TableCustomer, 'customer', 'customer.uid = tb.uid')
			qb.leftJoinAndMapOne('tb.appwr', dataBase.TableCaptcharAppwr, 'appwr', 'appwr.appId = tb.appId')
			qb.where('tb.uid = :uid', { uid })
			qb.skip((state.page - 1) * state.size)
			qb.take(state.size)
			return await qb.getManyAndCount()
		}).then(async ([list = [], total = 0]) => {
			return await divineResult({ total, list, size: state.size, page: state.page })
		})
	}
}
