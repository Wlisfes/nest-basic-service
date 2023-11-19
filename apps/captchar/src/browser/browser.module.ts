import { Module } from '@nestjs/common'
import { BrowserController } from '@captchar/browser/browser.controller'
import { BrowserService } from '@captchar/browser/browser.service'

@Module({
	imports: [],
	controllers: [BrowserController],
	providers: [BrowserService]
})
export class BrowserModule {}
