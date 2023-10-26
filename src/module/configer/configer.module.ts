import { Module, Global } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { customProvider } from '@/utils/utils-configer'

@Global()
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			cache: true,
			load: [customProvider]
		})
	],
	controllers: [],
	providers: []
})
export class ConfigerModule {}
