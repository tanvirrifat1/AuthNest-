import nodemailer from 'nodemailer';
import config from '../config';
import { errorLogger, logger } from '../shared/logger';
import { ISendEmail } from '../types/email';

const transporter = nodemailer.createTransport({
  host: config.email.host,
  // port: Number(config.email.port),
  // secure: false,
  secure: true,
  port: 465,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendEmail = async (values: ISendEmail) => {
  try {
    const info = await transporter.sendMail({
      from: `"HOLY-BOT-AI" ${config.email.from}`,
      to: values.to,
      subject: values.subject,
      html: values.html,
    });

    logger.info('Mail send successfully', info.accepted);
  } catch (error) {
    errorLogger.error('Email', error);
  }
};

export const emailHelper = {
  sendEmail,
};
