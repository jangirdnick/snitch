import config from '@/config/config.js';
import { createLogger } from '@/utils/logger.js';
import { Resend } from 'resend';

const logger = createLogger('RESEND');
const resend = new Resend(config.RESEND_API_KEY);

export class EmailDeliveryError extends Error {
  public readonly statusCode = 502;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = 'EmailDeliveryError';
    this.cause = cause;
  }
}

const sendEmail = async (params: { to: string; subject: string; html: string }): Promise<void> => {
  const { to, subject, html } = params;
  try {
    const { data, error } = await resend.emails.send({
      from: 'Snitch <no-reply@nickdstudio.online>',
      to,
      subject,
      html,
    });

    if (error) {
      logger.error({ error }, `Resend API returned error`);
      throw new EmailDeliveryError(error.message, error);
    }

    if (!data.id) {
      logger.error({ data }, 'empty response from Resend');
      throw new EmailDeliveryError('Empty response from Resend');
    }

    logger.info({ emailId: data.id, to }, 'Email send successfully');
  } catch (error) {
    if (error instanceof EmailDeliveryError) throw error;

    logger.error({ error, to }, 'Unexpected error sending email');
    throw new EmailDeliveryError('Failed to send email', error);
  }
};

export default sendEmail;
