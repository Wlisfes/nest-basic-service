import { Module } from '@nestjs/common'
import { AppController } from '@captchar-kueuer/app.controller'
import { AppService } from '@captchar-kueuer/app.service'

@Module({
	imports: [],
	controllers: [AppController],
	providers: [AppService]
})
export class AppModule {}
