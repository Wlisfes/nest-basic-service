import { Injectable, NestMiddleware, Logger } from '@nestjs/common'
import * as client from 'request-ip'

@Injectable()
export class FairMiddleware implements NestMiddleware {
	use(request: any, response: any, next: Function) {
		request.clientIP = client.getClientIp(request)
		Logger.log(request.clientIP)
		next()
	}
}
