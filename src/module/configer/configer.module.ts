import { Module, Global } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { customProvider } from '@/utils/utils-configer'

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
	providers: []
})
export class ConfigerModule {}
