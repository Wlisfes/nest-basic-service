import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BrowserController } from '@captchar/browser/browser.controller'
import { BrowserService } from '@captchar/browser/browser.service'
import { TableCaptcharAppwr } from '@/entity/tb-common.captchar__appwr'
import { TableCaptcharRecord } from '@/entity/tb-common.captchar__record'

@Module({
	imports: [
		ClientsModule.register([
			{
				name: 'CAPTCHAR_KUEUER',
				transport: Transport.TCP,
				options: {
					port: 5031
				}
			}
		]),
		TypeOrmModule.forFeature([TableCaptcharAppwr, TableCaptcharRecord])
	],
	controllers: [BrowserController],
	providers: [BrowserService]
})
export class BrowserModule {}
