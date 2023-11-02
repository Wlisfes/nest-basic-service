import { Module, Global } from '@nestjs/common'
import { APP_INTERCEPTOR, APP_FILTER, APP_GUARD } from '@nestjs/core'
import { AuthGuard } from '@/guard/auth.guard'
import { TransformInterceptor } from '@/interceptor/transform.interceptor'
import { HttpExceptionFilter } from '@/filter/http-exception.filter'

@Global()
@Module({
	imports: [],
	controllers: [],
	providers: [
		{ provide: APP_GUARD, useClass: AuthGuard },
		{ provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
		{ provide: APP_FILTER, useClass: HttpExceptionFilter }
	]
})
export class CustomizeModule {}
