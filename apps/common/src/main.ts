import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { Transport } from '@nestjs/microservices'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from '@common/app.module'
import * as express from 'express'
import * as cookieParser from 'cookie-parser'

async function useSwagger(app, opt: { authorize: string }) {
	const options = new DocumentBuilder()
		.setTitle(`Common基础服务`)
		.setDescription(`Common基础服务 Api Documentation`)
		.setVersion(`1.0.0`)
		.addBearerAuth({ type: 'apiKey', in: 'header', name: opt.authorize }, opt.authorize)
		.build()
	const document = SwaggerModule.createDocument(app, options)
	SwaggerModule.setup('api-doc', app, document, {
		customSiteTitle: `Common服务端API文档`,
		swaggerOptions: {
			defaultModelsExpandDepth: -1,
			defaultModelExpandDepth: 5,
			filter: true,
			docExpansion: 'none'
		}
	})
	return app
}

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const configService = app.get(ConfigService)
	const port = Number(configService.get('common.port') ?? 5010)
	await app.connectMicroservice({
		transport: Transport.TCP,
		options: { port }
	})

	//允许跨域
	app.enableCors()
	//解析body参数
	app.use(cookieParser())
	app.use(express.json())
	app.use(express.urlencoded({ extended: true }))
	//接口前缀
	app.setGlobalPrefix(configService.get('common.prefix'))
	//全局注册验证管道
	app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))
	//挂载文档
	await useSwagger(app, {
		authorize: configService.get('jwt.name')
	})
	await app.startAllMicroservices()
	//监听端口服务
	await app.listen(port, () => {
		console.log('Common服务启动:', `http://localhost:${port}`, `http://localhost:${port}/api-doc`)
	})
}
bootstrap()
