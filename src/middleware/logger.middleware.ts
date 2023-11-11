import { Inject, Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'
import { Logger } from 'winston'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}
	use(request: Request, response: Response, next: NextFunction) {
		const { baseUrl, method, body, query, params, headers } = request
		this.logger.info(LoggerMiddleware.name, {
			url: baseUrl,
			method,
			body,
			query,
			params,
			host: headers.host,
			origin: headers.origin,
			referer: headers.referer,
			['user-agent']: headers['user-agent']
		})
		next()
	}
}
