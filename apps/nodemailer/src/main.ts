import { NestFactory } from '@nestjs/core';
import { NodemailerModule } from './nodemailer.module';

async function bootstrap() {
  const app = await NestFactory.create(NodemailerModule);
  await app.listen(3000);
}
bootstrap();
