import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: () => {
        //VALIDAR SECRETO JWT DESDE EL .ENV
        const secret = process.env.JWT_SECRET;

        if (!secret) {
          throw new Error('Falta JWT_SECRET en las variables de entorno');
        }

        return {
          secret,
          //EXPIRACION DEL TOKEN EN UN DIA
          signOptions: { expiresIn: '1d' },
        };
      },
    }),
    UsersModule,
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}