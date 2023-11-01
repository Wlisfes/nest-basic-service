import { Module } from '@nestjs/common'
import { ConfigerModule } from '@/module/configer/configer.module'
import { DatabaseModule } from '@/module/database/database.module'
import { AppController } from '@captchar/app.controller'
import { AppService } from '@captchar/app.service'
import { AppwrModule } from '@captchar/appwr/appwr.module'
import { BrowserModule } from '@captchar/browser/browser.module'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { customProvider } from '@/utils/utils-configer'
const configer = customProvider()

console.log(configer.captchar.kueuer.port)

@Module({
	imports: [
		ClientsModule.register({
			isGlobal: true,
			clients: [
				{
					name: 'CAPTCHAR_KUEUER',
					transport: Transport.TCP,
					options: { port: configer.captchar.kueuer.port }
				}
			]
		}),
		ConfigerModule,
		DatabaseModule,
		AppwrModule,
		BrowserModule
	],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
