import { Module, Global, DynamicModule } from '@nestjs/common'
import { WinstonModule } from 'nest-winston'
import * as winston from 'winston'
import * as chalk from 'chalk'

import 'winston-daily-rotate-file'

@Global()
@Module({})
export class LoggerModule {
	public static forRoot(option: { name: string }): DynamicModule {
		return {
			module: LoggerModule,
			imports: [
				WinstonModule.forRoot({
					transports: [
						new winston.transports.DailyRotateFile({
							level: 'debug',
							dirname: `logs`, // 日志保存的目录
							filename: '%DATE%.log', // 日志名称，占位符 %DATE% 取值为 datePattern 值。
							datePattern: 'YYYY-MM-DD', // 日志轮换的频率，此处表示每天。
							zippedArchive: true, // 是否通过压缩的方式归档被轮换的日志文件。
							maxSize: '20m', // 设置日志文件的最大大小，m 表示 mb 。
							maxFiles: '30d', // 保留日志文件的最大天数，此处表示自动删除超过30天的日志文件。
							format: winston.format.combine(
								winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
								winston.format.json(),
								winston.format.printf(data => {
									const name = chalk.red(`[${option.name}]`)
									const pid = chalk.red(`${process.pid} -`)
									const timestamp = chalk.green(data.timestamp)
									const message = chalk.yellow(`[${data.message}]`)
									const url = chalk.yellow(`------ [${data.url ?? ''}]`)
									const module = `${name} ${pid} ${timestamp} ${message} ${url}`
									if (data.message === 'LoggerMiddleware') {
										return combineLoggerMiddleware(option.name, module, data)
									} else {
										return JSON.stringify(data)
									}
								})
							)
						})
					]
				})
			]
		}
	}
}

/**默认日志中间件格式组合**/ //prettier-ignore
function combineLoggerMiddleware(name: string, module: string, data) {
	console.info(module, {
		method: data.method,
		body: data.body,
		query: data.query,
		params: data.params,
		host: data.host,
		origin: data.origin,
		referer: data.referer,
		['user-agent']: data['user-agent']
	})
return `[${name}] ${process.pid} - ${data.timestamp} [${data.message}] ------ ${data.url} {
	"method": ${data.method},
	"body": ${JSON.stringify(data.body)},
	"query": ${JSON.stringify(data.query)},
	"params": ${JSON.stringify(data.params)},
	"host": ${data.host},
	"origin": ${data.origin},
	"referer": ${data.referer},
	"user-agent": ${data['user-agent']}
}`
}
