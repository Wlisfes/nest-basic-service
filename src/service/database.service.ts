import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as dataBase from '@/entity'

@Injectable()
export class DataBaseService {
	constructor(
		//Common
		@InjectRepository(dataBase.TableCustomer) public readonly tableCustomer: Repository<dataBase.TableCustomer>,
		@InjectRepository(dataBase.TableCustomerConfigur) public readonly tableCustomerConfigur: Repository<dataBase.TableCustomerConfigur>,
		//Captchar
		@InjectRepository(dataBase.TableCaptcharAppwr) public readonly tableCaptcharAppwr: Repository<dataBase.TableCaptcharAppwr>,
		@InjectRepository(dataBase.TableCaptcharRecord) public readonly tableCaptcharRecord: Repository<dataBase.TableCaptcharRecord>,
		//Nodemailer
		@InjectRepository(dataBase.TableNodemailerAppwr) public readonly tableNodemailerAppwr: Repository<dataBase.TableNodemailerAppwr>
	) {}
}
