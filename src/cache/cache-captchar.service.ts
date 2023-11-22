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
export class CacheAppwr extends CustomService {
	constructor(private readonly redisService: RedisService, private readonly dataBase: DataBaseService) {
		super()
	}

	/**缓存键**/
	public async cacheName(appId: string) {
		return `:captchar:cache:appwr:${appId}`
	}
}
