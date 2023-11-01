import { NestFactory } from '@nestjs/core'
import { Transport, MicroserviceOptions } from '@nestjs/microservices'
import { AppModule } from '@captchar-kueuer/app.module'
import { customProvider } from '@/utils/utils-configer'

async function bootstrap() {
	const configer = customProvider()
	const port = configer.port.captcharKueuer
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
		transport: Transport.TCP,
		options: { port }
	})
	await app.listen().then(e => {
		console.log('Captchar-kueuer服务启动:', `TCP: ${port}`)
	})
}
bootstrap()
