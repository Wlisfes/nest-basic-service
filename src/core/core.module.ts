import { Module, Global } from '@nestjs/common'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import { RedisService } from '@/core/redis.service'
//entity
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '@/entity/tb-user.entity'
import { CaptchaRecord, CaptchaApplication } from '@/entity/tb-captcha.entity'
//module
import { JobModule } from '@/job-module/job.module'
import { UserModule } from '@/user-module/user.module'
import { CaptchaModule } from '@/captcha-module/captcha.module'

@Global()
@Module({
	imports: [
		TypeOrmModule.forFeature([User, CaptchaApplication, CaptchaRecord]),
		JobModule,
		UserModule,
		CaptchaModule
	],
	providers: [CoreService, EntityService, RedisService],
	exports: [CoreService, EntityService, RedisService]
})
export class CoreModule {}
