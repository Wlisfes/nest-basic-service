import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { APP_INTERCEPTOR, APP_FILTER, APP_GUARD } from '@nestjs/core'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { RedisModule } from '@nestjs-modules/ioredis'
import { BullModule } from '@nestjs/bull'
import { I18nModule, HeaderResolver, I18nJsonLoader } from 'nestjs-i18n'
import { FairMiddleware } from '@/middleware/fair/fair.middleware'
import { AuthGuard } from '@/guard/auth.guard'
import { TransformInterceptor } from '@/interceptor/transform.interceptor'
import { HttpExceptionFilter } from '@/filter/http-exception.filter'
import { AppController } from '@/app.controller'
import { AppService } from '@/app.service'
import { CoreModule } from '@/core/core.module'
import * as path from 'path'

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		I18nModule.forRoot({
			fallbackLanguage: 'cn',
			loader: I18nJsonLoader,
			fallbacks: { cn: 'cn', en: 'en' },
			loaderOptions: {
				path: path.join(__dirname, '/i18n/'),
				watch: true
			},
			typesOutputPath: path.join(__dirname, '../src/i18n/i18n.interface.ts'),
			resolvers: [new HeaderResolver(['x-locale'])]
		}),
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
		RedisModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService) => ({
				config: {
					host: config.get('REDIS_HOST'),
					port: parseInt(config.get('REDIS_PORT')),
					password: config.get('REDIS_PASSWORD'),
					db: parseInt(config.get('REDIS_DB')),
					lazyConnect: false
				}
			})
		}),
		BullModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (config: ConfigService) => {
				const NODE_ENV = (process.env.NODE_ENV ?? '').toString().trim()
				const prefix = NODE_ENV === 'development' ? 'development' : 'production'
				return {
					prefix: prefix,
					redis: {
						host: config.get('REDIS_HOST'),
						port: parseInt(config.get('REDIS_PORT')),
						password: config.get('REDIS_PASSWORD'),
						db: config.get('REDIS_DB')
					}
				}
			}
		}),
		CoreModule
	],
	controllers: [AppController],
	providers: [
		AppService,
		{ provide: APP_GUARD, useClass: AuthGuard },
		{ provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
		{ provide: APP_FILTER, useClass: HttpExceptionFilter }
	]
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(FairMiddleware).forRoutes('/')
	}
}
