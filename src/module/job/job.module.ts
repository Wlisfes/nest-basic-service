import { Module, Global } from '@nestjs/common'
import { JobService } from '@/module/job/job.service'
import { BullModule } from '@nestjs/bull'
import { JobSupervisorConsumer } from '@/module/job/job.supervisor.consumer'
import { JOB_SUPERVISOR } from '@/config/job-config'

@Global()
@Module({
	imports: [BullModule.registerQueue({ name: JOB_SUPERVISOR.name })],
	providers: [JobService, JobSupervisorConsumer],
	exports: [JobService]
})
export class JobModule {}
