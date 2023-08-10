import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import * as client from 'request-ip'

@Injectable()
export class FairMiddleware implements NestMiddleware {
	use(request: Request, response: Response, next: NextFunction) {
		request.ip = client.getClientIp(request)
		next()
	}
}
