/**
 * Plantillas HTML institucionales de KYRIESROOM — Gestión Patrimonial.
 *
 * Todo el CSS es inline y la maquetación usa tablas para maximizar la
 * compatibilidad con clientes de correo (Gmail, Outlook, Apple Mail, etc.).
 */

export type TransactionTypeValue = 'INCOME' | 'EXPENSE' | 'PAYMENT';

export interface PasswordResetEmailInput {
  recipientName: string;
  resetUrl: string;
  token: string;
  expiresInMinutes: number;
}

export interface TransactionAlertEmailInput {
  recipientName: string;
  amount: number;
  type: TransactionTypeValue;
  concept: string;
  description?: string | null;
  subAccountName: string;
  transactionDate: Date;
  isCreditCard?: boolean;
}

export interface BuiltEmail {
  subject: string;
  html: string;
  text: string;
}

const COLORS = {
  background: '#08080C',
  surface: '#121218',
  surfaceAlt: '#17171F',
  primary: '#FF004D',
  text: '#F4F4F7',
  muted: '#9A9AA8',
  border: '#2A2A36',
  success: '#22C55E',
  warning: '#F59E0B',
} as const;

const FONT_SANS =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const FONT_MONO =
  "'Cascadia Mono', Consolas, 'Courier New', monospace";

export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatMoney(amount: number, currency = 'MXN'): string {
  const numeric = Number(amount);
  try {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number.isFinite(numeric) ? numeric : 0);
  } catch {
    return `$${(Number.isFinite(numeric) ? numeric : 0).toFixed(2)} ${currency}`;
  }
}

function formatDate(date: Date): string {
  const parsed = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(parsed.getTime())) return '—';
  try {
    return new Intl.DateTimeFormat('es-MX', {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(parsed);
  } catch {
    return parsed.toISOString();
  }
}

function actionButton(label: string, url: string): string {
  return `
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" align="center" style="margin: 8px auto 0 auto;">
      <tr>
        <td align="center" bgcolor="${COLORS.primary}" style="border-radius: 6px;">
          <a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer"
             style="display: inline-block; padding: 15px 34px; font-family: ${FONT_SANS}; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #08080C; text-decoration: none; border-radius: 6px;">
            ${escapeHtml(label)}
          </a>
        </td>
      </tr>
    </table>`;
}

function codeBlock(value: string): string {
  return `
    <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="margin-top: 18px;">
      <tr>
        <td align="center" style="background-color: ${COLORS.background}; border: 1px dashed ${COLORS.border}; border-radius: 8px; padding: 18px 16px;">
          <div style="font-family: ${FONT_MONO}; font-size: 12px; line-height: 18px; letter-spacing: 1px; color: ${COLORS.primary}; word-break: break-all;">
            ${escapeHtml(value)}
          </div>
        </td>
      </tr>
    </table>`;
}

function detailsCard(
  rows: Array<{ label: string; value: string; color?: string; mono?: boolean }>,
): string {
  const body = rows
    .map(
      (row, index) => `
        <tr>
          <td style="padding: 13px 0; border-bottom: ${index === rows.length - 1 ? 'none' : `1px solid ${COLORS.border}`}; font-family: ${FONT_SANS}; font-size: 11px; letter-spacing: 1px; text-transform: uppercase; color: ${COLORS.muted}; vertical-align: top; width: 42%;">
            ${escapeHtml(row.label)}
          </td>
          <td style="padding: 13px 0; border-bottom: ${index === rows.length - 1 ? 'none' : `1px solid ${COLORS.border}`}; font-family: ${row.mono ? FONT_MONO : FONT_SANS}; font-size: 14px; font-weight: 600; color: ${row.color ?? COLORS.text}; text-align: right; vertical-align: top; word-break: break-word;">
            ${escapeHtml(row.value)}
          </td>
        </tr>`,
    )
    .join('');

  return `
    <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0"
           style="margin-top: 24px; background-color: ${COLORS.surfaceAlt}; border: 1px solid ${COLORS.border}; border-radius: 10px;">
      <tr>
        <td style="padding: 8px 22px;">
          <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
            ${body}
          </table>
        </td>
      </tr>
    </table>`;
}

interface LayoutInput {
  preheader: string;
  eyebrow: string;
  title: string;
  intro: string;
  content: string;
  footerNote?: string;
}

function renderLayout(input: LayoutInput): string {
  const year = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="dark" />
  <meta name="supported-color-schemes" content="dark" />
  <title>KYRIESROOM — Gestión Patrimonial</title>
</head>
<body style="margin: 0; padding: 0; width: 100%; background-color: ${COLORS.background};">
  <!-- Preheader oculto -->
  <div style="display: none; max-height: 0; overflow: hidden; opacity: 0; mso-hide: all;">
    ${escapeHtml(input.preheader)}
  </div>

  <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0"
         style="background-color: ${COLORS.background}; padding: 28px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0"
               style="max-width: 600px; width: 100%; background-color: ${COLORS.surface}; border: 1px solid ${COLORS.border}; border-radius: 14px; overflow: hidden;">

          <!-- Línea superior de acento -->
          <tr>
            <td style="height: 3px; background-color: ${COLORS.primary}; font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>

          <!-- Encabezado institucional -->
          <tr>
            <td style="padding: 30px 32px 0 32px;">
              <table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="46" valign="middle">
                    <div style="width: 46px; height: 46px; background-color: ${COLORS.primary}; border-radius: 8px; color: #08080C; font-family: ${FONT_SANS}; font-size: 23px; font-weight: 700; text-align: center; line-height: 46px;">
                      K
                    </div>
                  </td>
                  <td valign="middle" style="padding-left: 14px;">
                    <div style="font-family: ${FONT_SANS}; font-size: 21px; font-weight: 700; letter-spacing: 4px; color: ${COLORS.text};">
                      KYRIESROOM
                    </div>
                    <div style="font-family: ${FONT_SANS}; font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: ${COLORS.muted}; padding-top: 3px;">
                      Gestión Patrimonial
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Contenido -->
          <tr>
            <td style="padding: 30px 32px 8px 32px;">
              <div style="font-family: ${FONT_MONO}; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: ${COLORS.primary};">
                ${escapeHtml(input.eyebrow)}
              </div>
              <h1 style="margin: 12px 0 0 0; font-family: ${FONT_SANS}; font-size: 24px; line-height: 32px; font-weight: 700; color: ${COLORS.text};">
                ${escapeHtml(input.title)}
              </h1>
              <p style="margin: 14px 0 0 0; font-family: ${FONT_SANS}; font-size: 14px; line-height: 23px; color: ${COLORS.muted};">
                ${escapeHtml(input.intro)}
              </p>
              ${input.content}
            </td>
          </tr>

          <!-- Pie de seguridad -->
          <tr>
            <td style="padding: 26px 32px 30px 32px;">
              <div style="height: 1px; background-color: ${COLORS.border}; font-size: 0; line-height: 0;">&nbsp;</div>
              <p style="margin: 18px 0 0 0; font-family: ${FONT_SANS}; font-size: 11px; line-height: 18px; color: ${COLORS.muted};">
                ${escapeHtml(
                  input.footerNote ??
                    'Correo automático del sistema. Nunca compartas tus credenciales ni el código de acción con terceros.',
                )}
              </p>
              <p style="margin: 14px 0 0 0; font-family: ${FONT_MONO}; font-size: 10px; letter-spacing: 1px; color: ${COLORS.muted};">
                SYSTEM TERMINAL v1.0.4 &nbsp;//&nbsp; SECURE CONNECTION &nbsp;//&nbsp; KYRIESROOM
              </p>
              <p style="margin: 8px 0 0 0; font-family: ${FONT_SANS}; font-size: 10px; color: #5C5C6B;">
                © ${year} KYRIESROOM — Gestión Patrimonial. Todos los derechos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildPasswordResetEmail(
  input: PasswordResetEmailInput,
): BuiltEmail {
  const expires = input.expiresInMinutes;

  const content = `
    ${actionButton('Restablecer conexión', input.resetUrl)}
    <p style="margin: 24px 0 0 0; font-family: ${FONT_SANS}; font-size: 12px; line-height: 19px; color: ${COLORS.muted}; text-align: center;">
      Si el botón no funciona, copia este código de acción:
    </p>
    ${codeBlock(input.token)}
    <p style="margin: 20px 0 0 0; font-family: ${FONT_SANS}; font-size: 12px; line-height: 20px; color: ${COLORS.muted};">
      El código caduca en <strong style="color: ${COLORS.warning};">${expires} minutos</strong> y solo puede usarse una vez.
      Si no solicitaste este cambio, ignora este mensaje: tu contraseña actual sigue siendo válida.
    </p>`;

  const html = renderLayout({
    preheader: `Restablece tu acceso a KYRIESROOM. El código caduca en ${expires} minutos.`,
    eyebrow: 'Seguridad // Recuperación de acceso',
    title: 'Restablece tu conexión',
    intro: `Hola ${input.recipientName || 'usuario'}, recibimos una solicitud para restablecer la contraseña de tu cuenta KYRIESROOM.`,
    content,
    footerNote:
      'Por seguridad, KYRIESROOM nunca te pedirá tu contraseña por correo. Si no reconoces esta solicitud, contacta al administrador.',
  });

  const text = [
    'KYRIESROOM — Gestión Patrimonial',
    'RECUPERACIÓN DE ACCESO',
    '',
    `Hola ${input.recipientName || 'usuario'},`,
    'Recibimos una solicitud para restablecer la contraseña de tu cuenta.',
    '',
    `Enlace: ${input.resetUrl}`,
    `Código: ${input.token}`,
    '',
    `El código caduca en ${expires} minutos.`,
    'Si no solicitaste este cambio, ignora este mensaje.',
    '',
    'SYSTEM TERMINAL v1.0.4 // SECURE CONNECTION // KYRIESROOM',
  ].join('\n');

  return { subject: 'Restablece tu acceso — KYRIESROOM', html, text };
}

export function buildTransactionAlertEmail(
  input: TransactionAlertEmailInput,
): BuiltEmail {
  const meta: Record<
    TransactionTypeValue,
    { label: string; sign: string; color: string }
  > = {
    INCOME: { label: 'Ingreso', sign: '+', color: COLORS.success },
    EXPENSE: { label: 'Gasto', sign: '-', color: COLORS.primary },
    PAYMENT: { label: 'Pago a tarjeta', sign: '-', color: COLORS.warning },
  };

  const info = meta[input.type] ?? meta.EXPENSE;
  const amountLabel = `${info.sign}${formatMoney(input.amount)}`;
  const dateLabel = formatDate(input.transactionDate);

  const rows: Array<{ label: string; value: string; color?: string; mono?: boolean }> = [
    { label: 'Tipo de movimiento', value: info.label, color: info.color },
    { label: 'Monto', value: amountLabel, color: info.color, mono: true },
    { label: 'Concepto', value: input.concept },
    { label: 'Subcuenta', value: input.subAccountName },
    { label: 'Fecha', value: dateLabel },
  ];

  if (input.type === 'EXPENSE') {
    rows.push({
      label: 'Tarjeta de crédito',
      value: input.isCreditCard ? 'Sí' : 'No',
    });
  }

  if (input.description?.trim()) {
    rows.push({ label: 'Descripción', value: input.description.trim() });
  }

  const content = `
    ${detailsCard(rows)}
    <p style="margin: 22px 0 0 0; font-family: ${FONT_SANS}; font-size: 12px; line-height: 20px; color: ${COLORS.muted};">
      Este movimiento ya fue registrado en tu base de datos local. Si no lo reconoces,
      revisa tus subcuentas y contacta de inmediato al administrador de tu patrimonio.
    </p>`;

  const html = renderLayout({
    preheader: `${info.label} por ${amountLabel} en ${input.subAccountName}.`,
    eyebrow: 'Alerta // Movimiento financiero',
    title: 'Nuevo movimiento registrado',
    intro: `Hola ${input.recipientName || 'usuario'}, se registró un movimiento en tu cuenta KYRIESROOM.`,
    content,
    footerNote:
      'Notificación automática de seguridad patrimonial. No respondas a este correo; fue generado por el sistema.',
  });

  const text = [
    'KYRIESROOM — Gestión Patrimonial',
    'ALERTA DE MOVIMIENTO FINANCIERO',
    '',
    `Hola ${input.recipientName || 'usuario'},`,
    'Se registró el siguiente movimiento:',
    '',
    `Tipo: ${info.label}`,
    `Monto: ${amountLabel}`,
    `Concepto: ${input.concept}`,
    `Subcuenta: ${input.subAccountName}`,
    `Fecha: ${dateLabel}`,
    ...(input.type === 'EXPENSE'
      ? [`Tarjeta de crédito: ${input.isCreditCard ? 'Sí' : 'No'}`]
      : []),
    ...(input.description?.trim()
      ? [`Descripción: ${input.description.trim()}`]
      : []),
    '',
    'SYSTEM TERMINAL v1.0.4 // SECURE CONNECTION // KYRIESROOM',
  ].join('\n');

  return {
    subject: `Alerta de movimiento: ${info.label} ${amountLabel} — KYRIESROOM`,
    html,
    text,
  };
}
