import { Module, Global } from '@nestjs/common'
import { APP_INTERCEPTOR, APP_FILTER, APP_GUARD } from '@nestjs/core'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { customProvider } from '@/utils/utils-configer'
import { AuthGuard } from '@/guard/auth.guard'

@Global()
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			cache: true,
			load: [customProvider]
		}),
		JwtModule
	],
	controllers: [],
	providers: [{ provide: APP_GUARD, useClass: AuthGuard }]
})
export class ConfigerModule {}
