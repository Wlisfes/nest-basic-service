import { Request, Response, NextFunction } from 'express'
import { Logger } from '@/utils/utils-logger'

/**函数式日志中间件**/
export function logger(request: Request, response: Response, next: NextFunction) {
	const code = response.statusCode
	next()
	/**组装日志信息**/
	const logFormat = `>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
请求参数
Referer: ${request.headers.referer},
Request URL: ${request.originalUrl}
Method: ${request.method}
IP: ${request.ip}
Status code: ${code}
Parmas: ${JSON.stringify(request.params)}
Query: ${JSON.stringify(request.query)}
Body: ${JSON.stringify(request.body)}
\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> \n`

	if (code >= 500) {
		Logger.error(logFormat)
	} else if (code >= 400) {
		Logger.warn(logFormat)
	} else {
		Logger.access(logFormat)
		Logger.log(logFormat)
	}
}
