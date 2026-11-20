import {
  Body,
  Controller,
  ForbiddenException,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import express from 'express';
import { CreateAuthDto } from './dto/auth-dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //cookies segun el entorno de ejecucion (local o en produccion)
  private getCookieOptions(): express.CookieOptions {
    const isProd = process.env.NODE_ENV === 'production';
    return {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      path: '/',
    };
  }

  @Post('login')
  async login(
    @Body() loginDto: CreateAuthDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    //validamos credenciales del user
    const userValidado = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    //traemos el servicio para validar al usuario y generar el token
    const token = this.authService.login(userValidado);

    //inyectamos la cookie httponly con duracion de un dia
    res.cookie('access_token', token, {
      ...this.getCookieOptions(),
      maxAge: 1000 * 60 * 60 * 24,
    });

    return { message: 'Login exitoso', userId: userValidado.id };
  }

  //RUTA PUBLICA DE REGISTRO (no lleva guard)
  //solo funciona si arrancas el backend con la variable ALLOW_REGISTER=true
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    if (process.env.ALLOW_REGISTER !== 'true') {
      throw new ForbiddenException('El registro está desactivado');
    }
    return await this.authService.register(createUserDto);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: express.Response) {
    //limpiamos cookie con las mismas opciones de creacion
    res.clearCookie('access_token', this.getCookieOptions());
    return { message: 'Sesión cerrada exitosamente' };
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
    //passthrough
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const emailValido = await this.authService.forgotPassword(forgotPasswordDto.email);

    return {
      message:
        'Si el correo está registrado, recibirás instrucciones para restablecer tu conexión',
    };
  }
}
