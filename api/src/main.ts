import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { env } from './env.type';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: env.FRONT_URL || 'http://localhost:3001',
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    });

    app.setGlobalPrefix('api');

    const config = new DocumentBuilder()
        .setTitle('Purple_Dog API')
        .setDescription('The Purple_Dog API description')
        .setVersion('1.0')
        .addTag('purple_dog')
        .addSecurity('basic', {
            type: 'http',
            scheme: 'basic',
        })
        .addBearerAuth()
        .build();

    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);

    app.useGlobalPipes(new ValidationPipe());

    await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
