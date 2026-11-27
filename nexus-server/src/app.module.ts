import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TransactionsModule } from './transactions/transactions.module';
import { SubAccountsModule } from './sub-accounts/sub-accounts.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';

//valida url de la base de datos al arrancar
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('Falta DATABASE_URL en el archivo .env');
}

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: databaseUrl,
      //habilita tls con verificacion para neon
      ssl: databaseUrl.includes('sslmode=require')
          ? { rejectUnauthorized: false }
          : false,
      entities: [],
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    TransactionsModule,
    SubAccountsModule,
    AuthModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
