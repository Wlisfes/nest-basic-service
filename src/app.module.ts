import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { AppController } from '@/app.controller'
import { AppService } from '@/app.service'
import { CoreModule } from '@/core/core.module'

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService) => {
				return {
					type: config.get('ORM_TYPE'),
					host: config.get('ORM_HOST'),
					port: parseInt(config.get('ORM_PORT')),
					username: config.get('ORM_USERNAME'),
					password: config.get('ORM_PASSWORD'),
					database: config.get('ORM_DATABASE'),
					charset: config.get('ORM_CHARSET'),
					synchronize: Boolean(JSON.parse(config.get('ORM_SYNCHRONIZE'))),
					dateStrings: Boolean(JSON.parse(config.get('ORM_DATESTRINGS'))),
					entities: ['dist/**/*.entity{.ts,.js}'],
					extra: {
						poolMax: 32,
						poolMin: 16,
						queueTimeout: 60000,
						pollPingInterval: 60,
						pollTimeout: 60
					}
				} as TypeOrmModuleOptions
			}
		}),
		CoreModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
