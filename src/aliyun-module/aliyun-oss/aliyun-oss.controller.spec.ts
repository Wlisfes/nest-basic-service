import { Test, TestingModule } from '@nestjs/testing';
import { AliyunOssController } from './aliyun-oss.controller';

describe('AliyunOssController', () => {
  let controller: AliyunOssController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AliyunOssController],
    }).compile();

    controller = module.get<AliyunOssController>(AliyunOssController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
