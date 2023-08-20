import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '@/entity/tb-user.entity'
import { CaptchaApplication, CaptchaRecord } from '@/entity/tb-captcha.entity'
import { tbMailerApplication } from '@/entity/tb-mailer__application.entity'
import { tbMailerPackage } from '@/entity/tb-mailer__package.entity'
import { tbMailerService } from '@/entity/tb-mailer__service.entity'
import { tbMailerTemplate } from '@/entity/tb-mailer__template.entity'
import { tbMailerSchedule } from '@/entity/tb-mailer__schedule.entity'
import { tbMailerRecord } from '@/entity/tb-mailer__record.entity'

@Injectable()
export class EntityService {
	constructor(
		@InjectRepository(User) public readonly user: Repository<User>,
		@InjectRepository(CaptchaApplication) public readonly captchaApplication: Repository<CaptchaApplication>,
		@InjectRepository(CaptchaRecord) public readonly captchaRecord: Repository<CaptchaRecord>,
		@InjectRepository(tbMailerApplication) public readonly mailerApplication: Repository<tbMailerApplication>,
		@InjectRepository(tbMailerPackage) public readonly mailerPackage: Repository<tbMailerPackage>,
		@InjectRepository(tbMailerService) public readonly mailerService: Repository<tbMailerService>,
		@InjectRepository(tbMailerTemplate) public readonly mailerTemplate: Repository<tbMailerTemplate>,
		@InjectRepository(tbMailerSchedule) public readonly mailerSchedule: Repository<tbMailerSchedule>,
		@InjectRepository(tbMailerRecord) public readonly mailerRecord: Repository<tbMailerRecord>
	) {}
}
