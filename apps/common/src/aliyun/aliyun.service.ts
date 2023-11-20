import { Injectable } from '@nestjs/common'
import { CustomService } from '@/service/custom.service'
import { CacheCustomer } from '@/cache/cache-customer.service'
import { DataBaseService } from '@/service/database.service'

@Injectable()
export class AliyunService extends CustomService {
	constructor(private readonly customer: CacheCustomer, private readonly dataBase: DataBaseService) {
		super()
	}
}
