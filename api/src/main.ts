import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api');

    const config = new DocumentBuilder()
        .setTitle('PurpleDog API')
        .setDescription('PurpleDog API description')
        .setVersion('1.0')
        .addTag('items')
        .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, documentFactory);

    app.useGlobalPipes(new ValidationPipe());

    await app.listen(3000);
}
bootstrap();
