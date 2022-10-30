import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Main')
@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'Hello, Task_Board In NestJS~!';
  }
}
