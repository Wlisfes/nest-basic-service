import { NestFactory } from '@nestjs/core'
import { Transport, MicroserviceOptions } from '@nestjs/microservices'
import { AppModule } from '@message-kueuer/app.module'
import { custom } from '@/utils/utils-configer'

async function bootstrap() {
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
		transport: Transport.TCP,
		options: {
			port: custom.message.kueuer.port
		}
	})
	await app.listen().then(e => {
		console.log('Message-kueuer服务启动:', `TCP: ${custom.message.kueuer.port}`)
	})
}
bootstrap()
