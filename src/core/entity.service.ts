import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '@/entity/tb-user.entity'
import { CaptchaApplication, CaptchaRecord } from '@/entity/tb-captcha.entity'
import { MailerApplication } from '@/entity/tb-mailer.entity'

@Injectable()
export class EntityService {
	constructor(
		@InjectRepository(User) public readonly user: Repository<User>,
		@InjectRepository(CaptchaApplication) public readonly captchaApplication: Repository<CaptchaApplication>,
		@InjectRepository(CaptchaRecord) public readonly captchaRecord: Repository<CaptchaRecord>,
		@InjectRepository(MailerApplication) public readonly mailerApplication: Repository<MailerApplication>
	) {}
}
