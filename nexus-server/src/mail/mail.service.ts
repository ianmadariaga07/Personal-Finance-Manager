import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as nodemailer from 'nodemailer';
import { getSmtpConfig } from './mail.config';
import {
  buildPasswordResetEmail,
  buildTransactionAlertEmail,
  PasswordResetEmailInput,
  TransactionAlertEmailInput,
} from './mail.templates';

export type PasswordResetMailInput = PasswordResetEmailInput & { to: string };
export type TransactionAlertMailInput = TransactionAlertEmailInput & {
  to: string;
};

@Injectable()
export class MailService implements OnModuleInit {
  private readonly logger = new Logger('MailService');

  constructor(private readonly mailerService: MailerService) {}

  onModuleInit(): void {
    const config = getSmtpConfig();

    if (!config) {
      this.logger.warn('No se pudo resolver la configuración SMTP.');
      return;
    }

    if (config.mode === 'stream') {
      this.logger.warn(
        'SMTP sin credenciales y Ethereal no disponible: usando transporte de streaming local (los correos se registran en consola).',
      );
      return;
    }

    if (config.isTestMode) {
      this.logger.warn(
        'SMTP_USER/SMTP_PASS vacíos o de ejemplo: usando cuenta de prueba Ethereal Email.',
      );
      this.logger.log(
        `Cuenta Ethereal activa: ${config.auth?.user ?? 'desconocida'} (credenciales solo en memoria)`,
      );
      return;
    }

    this.logger.log(
      `SMTP configurado: ${config.host}:${config.port} (secure=${config.secure})`,
    );
  }

  async sendPasswordReset(input: PasswordResetMailInput) {
    const { subject, html, text } = buildPasswordResetEmail(input);

    return this.deliver({
      to: input.to,
      subject,
      html,
      text,
      kind: 'recuperación de contraseña',
    });
  }

  async sendTransactionAlert(input: TransactionAlertMailInput) {
    const { subject, html, text } = buildTransactionAlertEmail(input);

    return this.deliver({
      to: input.to,
      subject,
      html,
      text,
      kind: 'alerta de movimiento financiero',
    });
  }

  private async deliver(payload: {
    to: string;
    subject: string;
    html: string;
    text: string;
    kind: string;
  }) {
    const info = await this.mailerService.sendMail({
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    });

    this.logger.log(
      `Correo de ${payload.kind} enviado a ${payload.to} (messageId: ${info?.messageId ?? 'n/d'})`,
    );

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      this.logger.log(`Vista previa del correo: ${previewUrl}`);
    }

    return info;
  }
}
