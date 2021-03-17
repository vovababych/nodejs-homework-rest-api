const Mailgen = require('mailgen');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

// class EmailService {
//   #sender = sgMail;
//   #GenerateTemplate = Mailgen;
//   constructor(env) {}
//   #createTemplate(verifyToken, name = 'Guest') {}
//   sendEmail(verifyToken, email, name) {}
// }
class EmailService {
  #sender = sgMail;
  #GenerateTemplate = Mailgen;
  #createTemplate(verifyToken, name) {
    const mailGenerator = new this.#GenerateTemplate({
      theme: 'default',
      product: {
        name: 'System contacts',
        link: 'http://localhost:3000/',
      },
    });

    const template = {
      body: {
        name,
        intro:
          "Welcome to System Contacts! We're very excited to have you on board.",
        action: {
          instructions:
            'To get started with System Contacts, please click here:',
          button: {
            color: '#22BC66', // Optional action button color
            text: 'Confirm your account',
            link: `http://localhost:3000/api/users/auth/verify/${verifyToken}`,
          },
        },
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };
    const emailBody = mailGenerator.generate(template);
    return emailBody;
  }

  async sendEmail(verifyToken, email, name) {
    const emailBody = await this.#createTemplate(verifyToken, name);
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: email,
      from: 'vovababych@gmail.com', // Use the email address or domain you verified above
      subject: 'Sending with Twilio SendGrid is Fun',
      html: emailBody,
    };
    await this.#sender.send(msg);
  }
}

module.exports = EmailService;
