import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from '@common/app.module'
import * as express from 'express'
import * as cookieParser from 'cookie-parser'

async function useSwagger(app) {
	const options = new DocumentBuilder()
		.setTitle(`Common基础服务`)
		.setDescription(`Common基础服务 Api Documentation`)
		.setVersion(`1.0.0`)
		.addBearerAuth({ type: 'apiKey', name: 'authorization', in: 'header' }, 'authorization')
		.build()
	const document = SwaggerModule.createDocument(app, options)
	SwaggerModule.setup('api-doc', app, document, {
		customSiteTitle: `服务端API文档`,
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
	const port = Number(app.get(ConfigService).get('port.common') ?? 5050)

	//允许跨域
	app.enableCors()
	//解析body参数
	app.use(cookieParser())
	app.use(express.json())
	app.use(express.urlencoded({ extended: true }))
	//全局注册验证管道
	app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))
	//挂载文档
	await useSwagger(app)
	//监听端口服务
	await app.listen(port, () => {
		console.log('Common服务启动:', `http://localhost:${port}`, `http://localhost:${port}/api-doc`)
	})
}
bootstrap()
