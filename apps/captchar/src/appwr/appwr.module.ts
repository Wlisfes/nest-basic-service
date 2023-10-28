import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TableCaptcharAppwr } from '@/entity/tb-common.captchar__appwr'
import { AppwrController } from '@captchar/appwr/appwr.controller'
import { AppwrService } from '@captchar/appwr/appwr.service'

@Module({
	imports: [TypeOrmModule.forFeature([TableCaptcharAppwr])],
	controllers: [AppwrController],
	providers: [AppwrService]
})
export class AppwrModule {}
