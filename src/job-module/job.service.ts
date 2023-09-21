import { Injectable } from '@nestjs/common'
import { Queue } from 'bull'
import { InjectQueue } from '@nestjs/bull'
import { JOB_CAPTCHA_SUPERVISOR } from '@/captcha-module/config/job-redis.resolver'
import { JOB_MAILER_SCHEDULE, JOB_MAILER_EXECUTE } from '@/mailer-module/config/job-redis.resolver'

@Injectable()
export class JobService {
	constructor(
		@InjectQueue(JOB_CAPTCHA_SUPERVISOR.name) public readonly captchaSupervisor: Queue,
		@InjectQueue(JOB_MAILER_SCHEDULE.name) public readonly mailerSchedule: Queue,
		@InjectQueue(JOB_MAILER_EXECUTE.name) public readonly mailerExecute: Queue
	) {}
}
