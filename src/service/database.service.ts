import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as database from '@/entity'

@Injectable()
export class DataBaseService {
	constructor(
		//Common
		@InjectRepository(database.TableCustomer) public readonly tableCustomer: Repository<database.TableCustomer>,
		@InjectRepository(database.TableCustomerConfigur) public readonly tableCustomerConfigur: Repository<database.TableCustomerConfigur>,
		//Captchar
		@InjectRepository(database.TableCaptcharAppwr) public readonly tableCaptcharAppwr: Repository<database.TableCaptcharAppwr>,
		@InjectRepository(database.TableCaptcharRecord) public readonly tableCaptcharRecord: Repository<database.TableCaptcharRecord>,
		//Nodemailer
		@InjectRepository(database.TableNodemailerAppwr) public readonly tableNodemailerAppwr: Repository<database.TableNodemailerAppwr>
	) {}
}
