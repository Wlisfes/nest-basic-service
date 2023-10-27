import { Module } from '@nestjs/common'
import { AppController } from '@captchar/app.controller'
import { AppService } from '@captchar/app.service'

@Module({
	imports: [],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
