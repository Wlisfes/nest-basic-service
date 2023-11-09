import { Module, Global, DynamicModule } from '@nestjs/common'
import { WinstonModule } from 'nest-winston'
import * as winston from 'winston'
import * as chalk from 'chalk'
import 'winston-daily-rotate-file'

export interface LoggerOption {
	module: string
}

@Global()
@Module({})
export class LoggerModule {
	public static forRoot(option: LoggerOption): DynamicModule {
		return {
			module: LoggerModule,
			imports: [
				WinstonModule.forRoot({
					transports: [
						new winston.transports.Console({
							level: 'error',
							format: winston.format.combine(
								winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
								winston.format.json(),
								winston.format.printf(data => {
									// console.log(data)
									// console.log(chalk`
									//     CPU: {red 30%}
									//     RAM: {green 45%}
									//     DISK: {rgb(255,131,0) 90%}
									// `)
									// console.log(chalk.blue('Hello') + ' World' + chalk.red('!'))

									// Compose multiple styles using the chainable API
									// console.log(chalk.blue.bgRed.bold('Hello world!'))
									console.log(chalk.hex('#eb3b3b').bold('Bold gray!'))

									return chalk.redBright(data.message)
								})
							)
						}),
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
									return JSON.stringify(data)
								})
							)
						})
					]
				})
			]
		}
	}
}
