import { Module, Global } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { custom } from '@/utils/utils-configer'
import { TableCustomer } from '@/entity/tb-common.customer'
import { TableCustomerConfigur } from '@/entity/tb-common.customer__configur'
import { TableCaptcharAppwr } from '@/entity/tb-common.captchar__appwr'
import { TableCaptcharRecord } from '@/entity/tb-common.captchar__record'
import { TableNodemailerAppwr } from '@/entity/tb-common.nodemailer__appwr'

@Global()
@Module({
	imports: [
		TypeOrmModule.forRoot({
			global: true,
			type: 'mysql',
			host: custom.db.mysql.host,
			port: custom.db.mysql.port,
			username: custom.db.mysql.username,
			password: custom.db.mysql.password,
			database: custom.db.mysql.database,
			charset: custom.db.mysql.charset,
			synchronize: custom.NODE_ENV === 'development',
			entities: [TableCustomer, TableCustomerConfigur, TableCaptcharAppwr, TableCaptcharRecord, TableNodemailerAppwr]
		})
	]
})
export class DatabaseModule {}
