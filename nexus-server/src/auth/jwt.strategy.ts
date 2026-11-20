import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error('Falta JWT_SECRET en las variables de entorno');
    }

    super({
      secretOrKey: jwtSecret,
      ignoreExpiration: false,
      //extraemos el token desde la cookie httponly
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request): string | null => {
          if (!req || !req.cookies) {
            return null;
          }
          //Saca solo la cookie llamada access_token y se la pasamos a Passport para que lo valide
          const cookies = req.cookies as Record<string, string>;
          return cookies['access_token'] ?? null;
        },
      ]),
    });
  }

  //inyectamos datos del payload en request.user
  validate(payload: { sub: string; email: string }) {
    return { userId: payload.sub, email: payload.email };
  }
}