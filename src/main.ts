import { NestFactory } from '@nestjs/core';
import * as appModule from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(appModule.AppModule);
  await app.listen(3000);
}
bootstrap();
