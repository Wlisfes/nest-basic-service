import { Injectable } from '@nestjs/common'
import { Queue } from 'bull'
import { InjectQueue } from '@nestjs/bull'
import { JOB_CAPTCHA_SUPERVISOR } from '@/config/job-config'

@Injectable()
export class JobService {
	constructor(@InjectQueue(JOB_CAPTCHA_SUPERVISOR.name) public readonly supervisor: Queue) {}
}
