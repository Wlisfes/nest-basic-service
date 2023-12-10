import { NestFactory } from '@nestjs/core'
import { Transport, MicroserviceOptions } from '@nestjs/microservices'
import { AppModule } from '@message-scheduler/app.module'
import { custom } from '@/utils/utils-configer'

async function bootstrap() {
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
		transport: Transport.TCP,
		options: {
			port: custom.message.scheduler.port
		}
	})
	await app.listen().then(e => {
		console.log('Message-Scheduler服务启动:', `TCP: ${custom.message.scheduler.port}`)
	})
}
bootstrap()
