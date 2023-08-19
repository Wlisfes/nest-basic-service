import { Module, Global } from '@nestjs/common'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import { RedisService } from '@/core/redis.service'
//entity
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '@/entity/tb-user.entity'
import { MailerPackage } from '@/entity/tb-package.entity'
import { CaptchaRecord, CaptchaApplication } from '@/entity/tb-captcha.entity'
import { tbMailerApplication } from '@/entity/tb-mailer__application.entity'
import { tbMailerService } from '@/entity/tb-mailer__service.entity'
import { tbMailerTemplate } from '@/entity/tb-mailer__template.entity'
import { tbMailerSchedule } from '@/entity/tb-mailer__schedule.entity'
import { tbMailerRecord } from '@/entity/tb-mailer__record.entity'
//module
import { JobModule } from '@/job-module/job.module'
import { UserModule } from '@/user-module/user.module'
import { CaptchaModule } from '@/captcha-module/captcha.module'
import { MailerModule } from '@/mailer-module/mailer.module'

@Global()
@Module({
	imports: [
		TypeOrmModule.forFeature([
			User,
			MailerPackage,
			CaptchaApplication,
			CaptchaRecord,
			tbMailerApplication,
			tbMailerService,
			tbMailerTemplate,
			tbMailerSchedule,
			tbMailerRecord
		]),
		JobModule,
		UserModule,
		CaptchaModule,
		MailerModule
	],
	providers: [CoreService, EntityService, RedisService],
	exports: [CoreService, EntityService, RedisService]
})
export class CoreModule {}
