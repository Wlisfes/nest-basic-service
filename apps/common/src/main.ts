import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from '@common/app.module'
import * as express from 'express'
import * as cookieParser from 'cookie-parser'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const port = Number(app.get(ConfigService).get('port.common') ?? 5050)

	//允许跨域
	app.enableCors()
	//解析body参数
	app.use(cookieParser())
	app.use(express.json())
	app.use(express.urlencoded({ extended: true }))
	//全局注册验证管道
	app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))
	//监听端口服务
	await app.listen(3000, () => {
		console.log('Common服务启动:', `http://localhost:${port}`, `http://localhost:${port}/api-doc`)
	})
}
bootstrap()