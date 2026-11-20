import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import {NestExpressApplication} from "@nestjs/platform-express";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  //CONFIAR EN EL PROXY INVERSO DE RENDER PARA COOKIES HTTPS
  app.set('trust proxy', 1);
  //validacion global, es el prefijo global de la api
  app.setGlobalPrefix('api'); //esto hace que las rutas sean /api/, pero es opcional
  app.useGlobalPipes(
    new ValidationPipe({
      //elimina los datos extra que no estén en los DTO
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  //parseo de cookies http only
  app.use(cookieParser());
  //origenes permitidos desde la variable de entorno
  const allowedOrigins = (process.env.FRONTEND_URL ?? 'http://localhost:4200')
      .split(',')
      .map((origin) => origin.trim());
  //configuracion del cors y credenciales activas
  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
