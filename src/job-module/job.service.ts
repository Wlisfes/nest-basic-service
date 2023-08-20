import { Injectable } from '@nestjs/common'
import { Queue } from 'bull'
import { InjectQueue } from '@nestjs/bull'
import * as job from '@/config/job-config'

@Injectable()
export class JobService {
	constructor(
		@InjectQueue(job.JOB_CAPTCHA_SUPERVISOR.name) public readonly supervisor: Queue,
		@InjectQueue(job.JOB_MAILER_SCHEDULE.name) public readonly mailer: Queue
	) {}
}
