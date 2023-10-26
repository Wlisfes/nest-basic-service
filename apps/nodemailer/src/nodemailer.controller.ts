import { Controller, Get } from '@nestjs/common';
import { NodemailerService } from './nodemailer.service';

@Controller()
export class NodemailerController {
  constructor(private readonly nodemailerService: NodemailerService) {}

  @Get()
  getHello(): string {
    return this.nodemailerService.getHello();
  }
}
