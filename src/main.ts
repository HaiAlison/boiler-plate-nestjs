import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config: ConfigService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const conf = new DocumentBuilder()
    .setTitle('Boiler plate swagger')
    .setDescription('The Warehouse API description')
    .setVersion('1.0')
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'x-api-key')
    .addBearerAuth(
      {
        description: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwidGVuYW50X2lkIjoiOTVjOTgwMzYtNjAzNC00OWRjLWFlNTYtZTlkNDZjODk4ZjJjIiwiY2xpZW50X2lkIjoiNmM1NmY1ZTQtMmRhYy00NzlkLTk2ZmItODEwMTI2MWM4ZTdiIiwiaXNfYWRtaW4iOmZhbHNlLCJ1c2VyX2lkIjoiYzU4NzE2ZjktYTY3Yy00MDU0LTk1MzItOTIzZmQzMTgxN2M0IiwidXNlcl9mdWxsX25hbWUiOiJDw7RuZyBUcuG7qSIsInNjb3BlcyI6ImV2ZW50OnZpZXcsZXZlbnQ6Y3JlYXRlLGV2ZW50OmVkaXQsZXZlbnQ6ZGVsZXRlLGV2ZW50OmhlYXRoX2V2YWx1YXRlOmV4ZWN1dGUiLCJncm91cHMiOlsiZDk5ZDMxM2MtNjQwZS00YWUzLWFmYWQtMmYyZWU2ZTFjZTgyOmJ1Il0sImlhdCI6MTY3NjUyMTE5MiwiZXhwIjoxNjc2NTIxMjUyfQ.QiDuVE_r33KHKi5409iyVpUNdF7u3YdhJ0albJdK2kg",
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'Authorization',
    )
    .addServer(
      `/${
        process.env.NODE_ENV === 'production' ? process.env.SERVICE_NAME : ''
      }`,
    )
    .build();
  const document = SwaggerModule.createDocument(app, conf);
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(config.get<number>('PORT'), () => {
    console.log(
      '\x1b[36m[WEB]: ',
      config.get<string>('BASE_URL') + config.get('PORT'),
    );
    console.log(
      '\x1b[36m[SWAGGER]: ',
      config.get<string>('BASE_URL') + config.get('PORT')+'/swagger',
    );
  });
}
bootstrap();
