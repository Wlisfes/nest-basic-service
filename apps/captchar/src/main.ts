import { NestFactory } from '@nestjs/core'
import { Transport } from '@nestjs/microservices'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from '@captchar/app.module'
import { custom } from '@/utils/utils-configer'
import * as express from 'express'
import * as cookieParser from 'cookie-parser'

async function useSwagger(app, opt: { authorize: string }) {
	const options = new DocumentBuilder()
		.setTitle(`Captchar基础服务`)
		.setDescription(`Captchar基础服务 Api Documentation`)
		.setVersion(`1.0.0`)
		.addBearerAuth({ type: 'apiKey', name: opt.authorize, in: 'header' }, opt.authorize)
		.build()
	const document = SwaggerModule.createDocument(app, options)
	SwaggerModule.setup('api-doc', app, document, {
		customSiteTitle: `Captchar服务端API文档`,
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
	//允许跨域
	app.enableCors()
	//解析body参数
	app.use(cookieParser())
	app.use(express.json())
	app.use(express.urlencoded({ extended: true }))
	//接口前缀
	app.setGlobalPrefix(custom.captchar.prefix)
	//全局注册验证管道
	app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))
	//挂载文档
	await useSwagger(app, { authorize: custom.jwt.name })
	//监听端口服务
	await app.listen(custom.captchar.port, () => {
		console.log(
			'Captchar服务启动:',
			`http://localhost:${custom.captchar.port}${custom.captchar.prefix}`,
			`http://localhost:${custom.captchar.port}/api-doc`
		)
	})
}
bootstrap()
