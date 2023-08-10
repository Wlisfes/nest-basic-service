import { NestFactory } from '@nestjs/core'
import { ValidationPipe, Logger } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { I18nValidationPipe } from 'nestjs-i18n'
import { AppModule } from '@/app.module'
import { SwaggerOption } from '@/config/swagger-config'
import { join } from 'path'
import * as express from 'express'
import * as cookieParser from 'cookie-parser'

async function useSwagger(app: NestExpressApplication) {
	const options = new DocumentBuilder()
		.setTitle(SwaggerOption.title)
		.setDescription(SwaggerOption.document)
		.setVersion(SwaggerOption.version)
		// .addBearerAuth(
		// 	{ type: 'apiKey', name: SwaggerOption.APP_AUTH_TOKEN, in: 'header' },
		// 	SwaggerOption.APP_AUTH_TOKEN
		// )
		.build()
	const document = SwaggerModule.createDocument(app, options)
	SwaggerModule.setup('api-doc', app, document, {
		customSiteTitle: SwaggerOption.customSiteTitle,
		swaggerOptions: {
			defaultModelsExpandDepth: SwaggerOption.defaultModelsExpandDepth,
			defaultModelExpandDepth: SwaggerOption.defaultModelExpandDepth,
			filter: SwaggerOption.filter,
			docExpansion: SwaggerOption.docExpansion
		}
	})
	return app
}

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule)

	app.useLogger(new Logger())
	//允许跨域
	app.enableCors()
	app.use(cookieParser())

	//解析body参数
	app.use(express.json())
	app.use(express.urlencoded({ extended: true }))
	app.setGlobalPrefix('/api-basic')

	//静态资源
	app.useStaticAssets(join(__dirname, '..', 'public'))
	//全局注册验证管道
	app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))
	//全局注册i18n管道
	app.useGlobalPipes(new I18nValidationPipe())

	//文档挂载
	await useSwagger(app)

	const port = process.env.PORT || 5002
	await app.listen(port, () => {
		console.log(`http://localhost:${port}`)
		console.log(`http://localhost:${port}/api-doc`)
	})
}
bootstrap()
