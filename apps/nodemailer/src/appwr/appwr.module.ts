import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppwrController } from '@nodemailer/appwr/appwr.controller'
import { AppwrService } from '@nodemailer/appwr/appwr.service'
import { TableNodemailerAppwr } from '@/entity/tb-common.nodemailer__appwr'

@Module({
	imports: [TypeOrmModule.forFeature([TableNodemailerAppwr])],
	controllers: [AppwrController],
	providers: [AppwrService]
})
export class AppwrModule {}
