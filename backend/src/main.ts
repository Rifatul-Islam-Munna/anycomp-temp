import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AllExceptionsFilter } from 'lib/all-exception-filter';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
     app.useGlobalPipes(new ValidationPipe({  transform: true,
  
  forbidNonWhitelisted: true,
transformOptions: {
        enableImplicitConversion: true,
      },}));
    const config = new DocumentBuilder()
      .setTitle('stmaps api')
      .setDescription('stmaps API description')
      .setVersion('1.0')
      .addTag('stmaps')
      .build();
   
    const document = SwaggerModule.createDocument(app, config);
      app.use(cookieParser());
    SwaggerModule.setup('api', app, document);
      app.useGlobalFilters(new AllExceptionsFilter());
  
  await app.listen(process.env.PORT ?? 4000);
}
void bootstrap();
