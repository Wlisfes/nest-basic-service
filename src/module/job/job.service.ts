import { Injectable } from '@nestjs/common'
import { Queue } from 'bull'
import { InjectQueue } from '@nestjs/bull'
import { JOB_SUPERVISOR } from '@/config/job-config'

@Injectable()
export class JobService {
	constructor(@InjectQueue(JOB_SUPERVISOR.name) public readonly supervisor: Queue) {}
}
