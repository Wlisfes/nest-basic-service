import { Injectable, NestMiddleware } from '@nestjs/common'
import * as client from 'request-ip'

@Injectable()
export class FairMiddleware implements NestMiddleware {
	use(request: any, response: any, next: Function) {
		request.clientIP = client.getClientIp(request)
		next()
	}
}
