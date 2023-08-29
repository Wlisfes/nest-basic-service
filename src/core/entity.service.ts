import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User, tbUserConsumer, tbUserConfigur } from '@/entity/tb-user.entity'
import { tbCaptchaApplication } from '@/entity/tb-captcha__application.entity'
import { tbCaptchaRecord } from '@/entity/tb-captcha__record.entity'
import { tbMailerApplication } from '@/entity/tb-mailer__application.entity'
import { tbMailerPackage, tbUserMailerPackage } from '@/entity/tb-mailer__package.entity'
import { tbMailerService } from '@/entity/tb-mailer__service.entity'
import { tbMailerTemplate } from '@/entity/tb-mailer__template.entity'
import { tbMailerSchedule } from '@/entity/tb-mailer__schedule.entity'
import { tbMailerRecord } from '@/entity/tb-mailer__record.entity'

@Injectable()
export class EntityService {
	constructor(
		@InjectRepository(User) public readonly user: Repository<User>,
		@InjectRepository(tbUserConfigur) public readonly userConfigur: Repository<tbUserConfigur>,
		@InjectRepository(tbUserConsumer) public readonly userConsumer: Repository<tbUserConsumer>,
		@InjectRepository(tbCaptchaApplication) public readonly captchaApplication: Repository<tbCaptchaApplication>,
		@InjectRepository(tbCaptchaRecord) public readonly captchaRecord: Repository<tbCaptchaRecord>,
		@InjectRepository(tbMailerApplication) public readonly mailerApplication: Repository<tbMailerApplication>,
		@InjectRepository(tbMailerPackage) public readonly mailerPackage: Repository<tbMailerPackage>,
		@InjectRepository(tbUserMailerPackage) public readonly userMailerPackage: Repository<tbUserMailerPackage>,
		@InjectRepository(tbMailerService) public readonly mailerService: Repository<tbMailerService>,
		@InjectRepository(tbMailerTemplate) public readonly mailerTemplate: Repository<tbMailerTemplate>,
		@InjectRepository(tbMailerSchedule) public readonly mailerSchedule: Repository<tbMailerSchedule>,
		@InjectRepository(tbMailerRecord) public readonly mailerRecord: Repository<tbMailerRecord>
	) {}
}
