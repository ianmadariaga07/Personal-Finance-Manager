import { IsEmail, MaxLength, MinLength } from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail({}, { message: 'Ingresa un correo valido' })
  @MinLength(6, { message: 'Faltan caracteres' })
  @MaxLength(100, { message: 'Limite de caracteres excedido' })
  email: string;
}