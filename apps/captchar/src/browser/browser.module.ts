import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BrowserController } from '@captchar/browser/browser.controller'
import { BrowserService } from '@captchar/browser/browser.service'
import { TableCaptcharAppwr } from '@/entity/tb-common.captchar__appwr'

@Module({
	imports: [TypeOrmModule.forFeature([TableCaptcharAppwr])],
	controllers: [BrowserController],
	providers: [BrowserService]
})
export class BrowserModule {}
