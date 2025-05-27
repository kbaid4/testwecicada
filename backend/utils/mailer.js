import nodemailer from 'nodemailer';

export const sendInviteEmail = async (to, name, inviteLink) => {
  // Set up transporter (using ethereal for dev or SMTP for prod)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT || 587,
    auth: {
      user: process.env.SMTP_USER || 'your_ethereal_user',
      pass: process.env.SMTP_PASS || 'your_ethereal_pass',
    },
  });

  const info = await transporter.sendMail({
    from: 'no-reply@wecicada.com',
    to,
    subject: 'You are invited to join WeCicada!',
    html: `<p>Hello ${name || ''},</p>
           <p>You have been invited to join the WeCicada platform as a supplier.</p>
           <p>Please click the link below to sign up and get started:</p>
           <a href="${inviteLink}">${inviteLink}</a>
           <p>If you did not expect this invitation, you can ignore this email.</p>`
  });

  return info;
};
