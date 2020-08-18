const nodemailer = require('nodemailer');

exports.sendEmail = async user => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  await transporter.sendMail({
    from: 'Node.JS training <aatar@itba.edu.ar>',
    to: user.email,
    subject: 'Bienvenido al training de Node.js',
    html: `<span style='font-size: 16px;font-weight: bold;'>Hola ${user.name}!\
      Te damos la bienvenida al training de Node.JS</span>`
  });
};
