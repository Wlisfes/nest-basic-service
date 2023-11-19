import { Module } from '@nestjs/common'
import { AppwrController } from '@captchar/appwr/appwr.controller'
import { AppwrService } from '@captchar/appwr/appwr.service'

@Module({
	imports: [],
	controllers: [AppwrController],
	providers: [AppwrService]
})
export class AppwrModule {}
