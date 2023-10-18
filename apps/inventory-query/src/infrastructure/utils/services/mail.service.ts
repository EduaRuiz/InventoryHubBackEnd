import { IMailDomainService } from '@domain-services';
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { Observable, from } from 'rxjs';

@Injectable()
export class MailService implements IMailDomainService {
  private readonly transporter: Transporter<SMTPTransport.SentMessageInfo>;
  private readonly emailFrom: string = 'tooltraxpro@gmail.com';
  private readonly password: string = 'jqibdeyxvslammgd';
  private readonly template: string = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title>{subject}</title>
    </head>
    <body>
      <h1>{subject}</h1>
      <p>{body}</p>
    </body>
  </html>
`;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: this.emailFrom,
        pass: this.password,
      },
    });
  }

  sendEmail(
    to: string[],
    subject: string,
    body: string,
    template?: string,
  ): Observable<string> {
    const mailOptions = {
      from: this.emailFrom,
      to: to.join(', '),
      subject: subject,
      text: body,
      html:
        template ??
        this.template
          .replace('{subject}', subject)
          .replace('{body}', body)
          .replace('{subject}', subject),
    };

    return from(
      new Promise<string>((resolve, reject) => {
        this.transporter.sendMail(mailOptions, (error, info) => {
          error
            ? reject(`Error al enviar el correo: ${error}`)
            : resolve(`Correo enviado: ${info.response}`);
        });
      }),
    );
  }
}
