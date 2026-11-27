import * as nodemailer from 'nodemailer';

/**
 * Resuelve la configuración SMTP a partir de las variables de entorno.
 *
 * Modo seguro: si SMTP_USER / SMTP_PASS están vacíos o contienen valores de
 * ejemplo, se crea automáticamente una cuenta gratuita de Ethereal Email
 * (nodemailer.createTestAccount). Si Ethereal no estuviera disponible, se cae
 * a un transporte de streaming local para que el envío NUNCA rompa la app.
 */
export type TransportMode = 'smtp' | 'stream';

export interface SmtpConfig {
  mode: TransportMode;
  isTestMode: boolean;
  host: string;
  port: number;
  secure: boolean;
  auth?: { user: string; pass: string };
  from: string;
}

// Valores típicos de plantilla que NO deben considerarse credenciales reales.
const PLACEHOLDER_PATTERN =
  /^(tu_|your_|example|ejemplo|changeme|cambiar|xxxx|placeholder|usuario|correo@|contrase)/i;

const EXAMPLE_HOST_PATTERN = /(^|\.)example\.(com|org|net)$/i;

function isBlankOrPlaceholder(value?: string): boolean {
  const trimmed = value?.trim();
  return !trimmed || PLACEHOLDER_PATTERN.test(trimmed);
}

let cachedConfig: SmtpConfig | null = null;

export async function resolveSmtpConfig(): Promise<SmtpConfig> {
  if (cachedConfig) return cachedConfig;

  const from =
    process.env.SMTP_FROM?.trim() ||
    'KYRIESROOM Gestión Patrimonial <no-reply@kyriesroom.local>';

  const host = process.env.SMTP_HOST?.trim() || 'smtp.ethereal.email';
  const port = Number(process.env.SMTP_PORT ?? 587);
  const secure = String(process.env.SMTP_SECURE ?? 'false').toLowerCase() === 'true';
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  const hasRealCredentials =
    !isBlankOrPlaceholder(user) &&
    !isBlankOrPlaceholder(pass) &&
    !EXAMPLE_HOST_PATTERN.test(host);

  if (hasRealCredentials) {
    cachedConfig = {
      mode: 'smtp',
      isTestMode: false,
      host,
      port,
      secure,
      auth: { user: user!.trim(), pass: pass!.trim() },
      from,
    };
    return cachedConfig;
  }

  // Sin credenciales reales -> Ethereal Email (modo desarrollo).
  try {
    const account = await nodemailer.createTestAccount();
    cachedConfig = {
      mode: 'smtp',
      isTestMode: true,
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: account.user, pass: account.pass },
      from,
    };
    return cachedConfig;
  } catch (error) {
    // Último recurso: transporte local en memoria, no requiere red.
    // eslint-disable-next-line no-console
    console.warn(
      '[MailConfig] No se pudo crear la cuenta Ethereal, usando transporte de streaming local:',
      error instanceof Error ? error.message : String(error),
    );
    cachedConfig = {
      mode: 'stream',
      isTestMode: true,
      host: 'stream',
      port: 0,
      secure: false,
      from,
    };
    return cachedConfig;
  }
}

export function getSmtpConfig(): SmtpConfig | null {
  return cachedConfig;
}
