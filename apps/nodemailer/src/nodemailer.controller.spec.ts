import { Test, TestingModule } from '@nestjs/testing';
import { NodemailerController } from './nodemailer.controller';
import { NodemailerService } from './nodemailer.service';

describe('NodemailerController', () => {
  let nodemailerController: NodemailerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [NodemailerController],
      providers: [NodemailerService],
    }).compile();

    nodemailerController = app.get<NodemailerController>(NodemailerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(nodemailerController.getHello()).toBe('Hello World!');
    });
  });
});
