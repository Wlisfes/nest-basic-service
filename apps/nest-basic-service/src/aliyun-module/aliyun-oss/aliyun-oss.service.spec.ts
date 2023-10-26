import { Test, TestingModule } from '@nestjs/testing';
import { AliyunOssService } from './aliyun-oss.service';

describe('AliyunOssService', () => {
  let service: AliyunOssService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AliyunOssService],
    }).compile();

    service = module.get<AliyunOssService>(AliyunOssService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
