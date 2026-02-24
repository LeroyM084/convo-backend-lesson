import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { buildGlobalValidationPipe } from './core/http/validation/validations.pipe';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './core/http/exeptions/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(buildGlobalValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());

  // Configuration Swagger
  const config = new DocumentBuilder()
    .setTitle('Notes API')
    .setDescription('API documentation for Notes Backend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
