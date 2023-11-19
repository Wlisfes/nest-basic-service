import { Module, Global } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { DataBaseService } from '@/service/database.service'
import { custom } from '@/utils/utils-configer'
import * as database from '@/entity'

/**数据库表实体**/
export const TableDatabase = Object.values(database)

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
			entities: TableDatabase
		}),
		TypeOrmModule.forFeature(TableDatabase)
	],
	providers: [DataBaseService],
	exports: [DataBaseService]
})
export class DatabaseModule {}
