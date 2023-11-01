import { NestFactory } from '@nestjs/core'
import { AppModule } from '@captchar-kueuer/app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	await app.listen(3000)
}
bootstrap()
