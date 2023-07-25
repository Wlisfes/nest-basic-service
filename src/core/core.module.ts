import { Module, Global } from '@nestjs/common'
import { CoreService } from '@/core/core.service'
import { EntityService } from '@/core/entity.service'
import { RedisService } from '@/core/redis.service'

//entity
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserEntity } from '@/entity/user.entity'

@Global()
@Module({
	imports: [TypeOrmModule.forFeature([UserEntity])],
	providers: [CoreService, EntityService, RedisService],
	exports: [CoreService, EntityService, RedisService]
})
export class CoreModule {}
