import nodemailer from 'nodemailer';

const sendEmail = async (to, subject, text, html) => {
    const smtpPort = Number(process.env.SMTP_PORT) || 465;
    const smtpSecure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : smtpPort === 465;
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: smtpPort,
        secure: smtpSecure,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });
    const mailOptions = {
        from: `${'Unhide Nepal'} <${process.env.SMTP_EMAIL}>`,
        to,
        subject,
        text,
        html,
    };
    await transporter.sendMail(mailOptions);

    return true;
};

export default sendEmail;