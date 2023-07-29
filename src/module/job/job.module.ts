import { Module } from '@nestjs/common'
import { JobService } from '@/module/job/job.service'
import { BullModule } from '@nestjs/bull'
import { JobConsumer } from '@/module/job/job.consumer'
import * as JobName from '@/config/job-config'

@Module({
	imports: [BullModule.registerQueue({ name: JobName.JOB_SUPERVISOR })],
	providers: [JobService, JobConsumer],
	exports: [JobService]
})
export class JobModule {}
