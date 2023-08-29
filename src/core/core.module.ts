import { Module, Global } from '@nestjs/common'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import { RedisService } from '@/core/redis.service'
//entity
import { TypeOrmModule } from '@nestjs/typeorm'
import { User, tbUserConsumer, tbUserConfigur } from '@/entity/tb-user.entity'
import { tbCaptchaApplication } from '@/entity/tb-captcha__application.entity'
import { tbCaptchaRecord } from '@/entity/tb-captcha__record.entity'
import { tbMailerPackage, tbUserMailerPackage } from '@/entity/tb-mailer__package.entity'
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
			tbUserConsumer,
			tbUserConfigur,
			tbCaptchaApplication,
			tbCaptchaRecord,
			tbMailerApplication,
			tbMailerPackage,
			tbUserMailerPackage,
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
