import { Module, Global } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TableCustomer } from '@/entity/tb-common.customer'
import { TableCaptcharAppwr } from '@/entity/tb-common.captchar__appwr'

@Global()
@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				global: true,
				type: 'mysql',
				host: configService.get('db.mysql.host'),
				port: configService.get('db.mysql.port'),
				username: configService.get('db.mysql.username'),
				password: configService.get('db.mysql.password'),
				database: configService.get('db.mysql.database'),
				charset: configService.get('db.mysql.charset'),
				synchronize: configService.get('NODE_ENV') === 'development',
				entities: [TableCustomer, TableCaptcharAppwr]
			})
		})
	],
	controllers: [],
	providers: [],
	exports: []
})
export class DatabaseModule {}
