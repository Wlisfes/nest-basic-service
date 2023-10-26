import { Injectable } from '@nestjs/common';

@Injectable()
export class NodemailerService {
  getHello(): string {
    return 'Hello World!';
  }
}
