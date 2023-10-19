import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailService],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send an email successfully', (done) => {
    const to = ['example@example.com'];
    const subject = 'Test Email';
    const body = 'This is a test email.';
    const template = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${subject}</title>
        </head>
        <body>
          <h1>${subject}</h1>
          <p>${body}</p>
        </body>
      </html>
    `;

    service.sendEmail(to, subject, body, template).subscribe((result) => {
      expect(result).toMatch(/Correo enviado:/);
      done();
    });
  });
});
