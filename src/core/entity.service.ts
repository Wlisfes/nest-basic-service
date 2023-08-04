import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '@/entity/tb-user.entity'
import { CheckRecord, CheckApplication } from '@/entity/tb-check.entity'

@Injectable()
export class EntityService {
	constructor(
		@InjectRepository(User) public readonly user: Repository<User>,
		@InjectRepository(CheckApplication) public readonly checkApplication: Repository<CheckApplication>,
		@InjectRepository(CheckRecord) public readonly checkRecord: Repository<CheckRecord>
	) {}
}
