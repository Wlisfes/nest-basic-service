import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '@/entity/tb-user.entity'
import { MailerPackage } from '@/entity/tb-package.entity'
import { CaptchaApplication, CaptchaRecord } from '@/entity/tb-captcha.entity'
import { MailerApplication, MailerService, MailerTemplate, MailerTask, MailerRecord } from '@/entity/tb-mailer.entity'

@Injectable()
export class EntityService {
	constructor(
		@InjectRepository(User) public readonly user: Repository<User>,
		@InjectRepository(MailerPackage) public readonly mailerPackage: Repository<MailerPackage>,
		@InjectRepository(CaptchaApplication) public readonly captchaApplication: Repository<CaptchaApplication>,
		@InjectRepository(CaptchaRecord) public readonly captchaRecord: Repository<CaptchaRecord>,
		@InjectRepository(MailerApplication) public readonly mailerApplication: Repository<MailerApplication>,
		@InjectRepository(MailerService) public readonly mailerService: Repository<MailerService>,
		@InjectRepository(MailerTemplate) public readonly mailerTemplate: Repository<MailerTemplate>,
		@InjectRepository(MailerTask) public readonly mailerTask: Repository<MailerTask>,
		@InjectRepository(MailerRecord) public readonly mailerRecord: Repository<MailerRecord>
	) {}
}
