import { Module } from '@nestjs/common';
import { NodemailerController } from './nodemailer.controller';
import { NodemailerService } from './nodemailer.service';

@Module({
  imports: [],
  controllers: [NodemailerController],
  providers: [NodemailerService],
})
export class NodemailerModule {}
