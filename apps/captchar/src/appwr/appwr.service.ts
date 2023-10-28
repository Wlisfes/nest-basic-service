import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { TableCaptcharAppwr } from '@/entity/tb-common.captchar__appwr'
import { divineIntNumber } from '@/utils/utils-common'
import { CreateAppwr } from '@captchar/interface/appwr.resolver'

@Injectable()
export class AppwrService {
	constructor(@InjectRepository(TableCaptcharAppwr) public readonly tableCaptcharAppwr: Repository<TableCaptcharAppwr>) {}

	/**创建应用**/
	public async httpCreateAppwr(state: CreateAppwr, uid: string) {
		return state
	}
}
