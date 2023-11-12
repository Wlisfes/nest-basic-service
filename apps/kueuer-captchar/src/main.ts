import { NestFactory } from '@nestjs/core'
import { Transport, MicroserviceOptions } from '@nestjs/microservices'
import { AppModule } from '@kueuer-captchar/app.module'
import { custom } from '@/utils/utils-configer'

async function bootstrap() {
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
		transport: Transport.TCP,
		options: { port: custom.captchar.kueuer.port }
	})
	await app.listen().then(e => {
		console.log('Kueuer-Captchar服务启动:', `TCP: ${custom.captchar.kueuer.port}`)
	})
}
bootstrap()
