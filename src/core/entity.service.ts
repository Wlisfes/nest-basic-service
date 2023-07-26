import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserEntity } from '@/entity/user.entity'
import { AppEntity } from '@/entity/app.entity'
import { RecordEntity } from '@/entity/record.entity'

@Injectable()
export class EntityService {
	constructor(
		@InjectRepository(UserEntity) public readonly userModel: Repository<UserEntity>,
		@InjectRepository(AppEntity) public readonly appModel: Repository<AppEntity>,
		@InjectRepository(RecordEntity) public readonly recordModel: Repository<RecordEntity>
	) {}
}
