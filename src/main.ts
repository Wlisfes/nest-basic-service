import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { I18nValidationPipe } from 'nestjs-i18n'
import { AppModule } from '@/app.module'
import { join } from 'path'
import * as express from 'express'
import * as cookieParser from 'cookie-parser'

async function useSwagger(app: NestExpressApplication) {
	const options = new DocumentBuilder()
		.setTitle('Nest-Captcha-Service')
		.setDescription('Nest-Captcha-Service Api Documentation')
		.setVersion('1.0')
		// .addBearerAuth({ type: 'apiKey', name: APP_AUTH_TOKEN, in: 'header' }, APP_AUTH_TOKEN)
		.build()
	const document = SwaggerModule.createDocument(app, options)
	SwaggerModule.setup('api-doc', app, document, {
		customSiteTitle: '服务端API文档',
		swaggerOptions: {
			defaultModelsExpandDepth: -1,
			defaultModelExpandDepth: 5,
			filter: true
		}
	})
	return app
}

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		logger: ['debug']
	})

	//允许跨域
	app.enableCors()
	app.use(cookieParser())

	//解析body参数
	app.use(express.json())
	app.use(express.urlencoded({ extended: true }))
	app.setGlobalPrefix('/api-captcha')

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
