import { NestFactory } from '@nestjs/core'
import { Transport, MicroserviceOptions } from '@nestjs/microservices'
import { AppModule } from '@kueuer-captchar/app.module'
import { CustomProvider } from '@/utils/utils-configer'

async function bootstrap() {
	const configer = CustomProvider()
	const port = configer.kueuer.captchar.port
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
		transport: Transport.TCP,
		options: { port }
	})
	await app.listen().then(e => {
		console.log('Kueuer-Captchar服务启动:', `TCP: ${port}`)
	})
}
bootstrap()
