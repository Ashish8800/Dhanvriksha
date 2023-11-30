const nodemailer = require("nodemailer");

/**
 * It sends an email to the user's email address with the subject and text provided
 * @param email - The email address of the user you want to send the email to.
 * @param subject - The subject of the email.
 * @param text - The text that you want to send to the user.
 */
const sendEmail = async (email, subject, text) => {
  try {
  LU
  /* Creating a transporter object that will be used to send the email. */
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: 587,
      secure: true,
      auth: {
        user: process.env.GMAILUSER,
        pass: process.env.PASS,
      },
    });

    /* Creating an object with the email details. */
    let mailDetails = {
      from: process.env.GMAILUSER,
      to: email,
      subject: subject,
      html: "<h2>" + text + "</h2>",
    };
    await transporter.sendMail(mailDetails);
  } catch (error) {
  }
};

/* Exporting the function `sendEmail` so that it can be used in other files. */
module.exports = sendEmail;
