import { Module, Global } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

@Global()
@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				const { host, port, username, password, database, charset } = configService.get('db.mysql')
				return {
					type: 'mysql',
					host,
					port,
					username,
					password,
					database,
					charset,
					entities: []
				}
			}
		})
	],
	controllers: [],
	providers: []
})
export class DatabaseModule {}
