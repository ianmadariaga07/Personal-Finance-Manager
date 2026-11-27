import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { resolveSmtpConfig } from './mail.config';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async () => {
        // Resuelve SMTP real o crea automáticamente la cuenta Ethereal.
        const config = await resolveSmtpConfig();

        const transport =
          config.mode === 'stream'
            ? {
                streamTransport: true,
                buffer: true,
                newline: 'unix' as const,
              }
            : {
                host: config.host,
                port: config.port,
                secure: config.secure,
                auth: config.auth,
              };

        return {
          transport,
          defaults: { from: config.from },
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
