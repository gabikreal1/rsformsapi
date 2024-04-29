import { NestFactory } from '@nestjs/core';
import * as appModule from './app.module';
import { AuthIoAdapter } from './AuthWebsocket.adapter';

async function bootstrap() {

  const app = await NestFactory.create(appModule.AppModule);
  app.enableCors();
  app.useWebSocketAdapter(new AuthIoAdapter(app));
  await app.listen(8080,'192.168.1.21');
}
bootstrap();
