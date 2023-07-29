import { Module, Global } from '@nestjs/common'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import { RedisService } from '@/core/redis.service'
//entity
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from '@/entity/user.entity'
import { AppEntity } from '@/entity/app.entity'
import { RecordEntity } from '@/entity/record.entity'
//module
import { JobModule } from '@/module/job/job.module'
import { UserModule } from '@/module/user/user.module'
import { AppModule } from '@/module/app/app.module'
import { SupervisorModule } from '@/module/supervisor/supervisor.module'

@Global()
@Module({
	imports: [
		TypeOrmModule.forFeature([UserEntity, AppEntity, RecordEntity]),
		JobModule,
		UserModule,
		AppModule,
		SupervisorModule
	],
	providers: [CoreService, EntityService, RedisService],
	exports: [CoreService, EntityService, RedisService]
})
export class CoreModule {}
