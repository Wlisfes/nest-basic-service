import { Injectable } from '@nestjs/common'
import { Brackets } from 'typeorm'
import { isEmpty } from 'class-validator'
import { CustomService } from '@/service/custom.service'
import { RedisService } from '@/service/redis.service'
import { DataBaseService } from '@/service/database.service'
import { divineResult } from '@/utils/utils-common'
import { divineCatchWherer, divineCreateJwtToken, divineClientSender } from '@/utils/utils-plugin'
import * as dataBase from '@/entity'

@Injectable()
export class CacheCustomer extends CustomService {
	constructor(private readonly redisService: RedisService, private readonly dataBase: DataBaseService) {
		super()
	}

	/**缓存键**/
	public async createWriteName(uid: string) {
		return `:common:cache:customer:${uid}`
	}

	/**读取用户缓存**/
	public async readCustomer(uid: string) {
		return await this.createWriteName(uid).then(async cacheName => {
			const cacheNode = await this.redisService.getStore<dataBase.TableCustomer>(cacheName)
			if (isEmpty(cacheNode)) {
				return await this.validator(this.dataBase.tableCustomer, {
					message: '账户不存在',
					join: { alias: 'tb' },
					where: new Brackets(qb => {
						qb.where('tb.uid = :uid', { uid })
						qb.andWhere('tb.status IN(:...status)', { status: ['enable', 'disable'] })
					})
				}).then(async data => {
					await this.writeCustomer(uid, { ...data })
					return await divineResult({ ...data })
				})
			}
			return cacheNode
		})
	}

	/**写入用户缓存**/
	public async writeCustomer(uid: string, data: Record<string, any>) {
		return await this.createWriteName(uid).then(async cacheName => {
			return await this.redisService.setStore(cacheName, data)
		})
	}

	/**校验当前用户**/
	public async checkCustomer(uid: string, command: Array<string>) {
		return await this.readCustomer(uid).then(async data => {
			await divineCatchWherer(command.includes(data.status), {
				message: '账户已被禁用'
			})
			return data
		})
	}
}
