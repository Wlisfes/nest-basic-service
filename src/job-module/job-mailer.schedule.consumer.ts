import { Logger } from '@nestjs/common'
import { Processor, Process, OnQueueProgress, OnQueueCompleted, OnQueueFailed, OnQueueRemoved } from '@nestjs/bull'
import { Job } from 'bull'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import { JOB_MAILER_SCHEDULE } from '@/config/job-config'

@Processor({ name: JOB_MAILER_SCHEDULE.name })
export class JobMailerScheduleConsumer extends CoreService {
	private readonly logger = new Logger(JobMailerScheduleConsumer.name)
	constructor(private readonly event: EventEmitter2, private readonly entity: EntityService) {
		super()
	}
}
