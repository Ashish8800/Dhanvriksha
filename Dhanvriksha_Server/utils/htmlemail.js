var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
var handlebars = require("handlebars");
var fs = require("fs");

/* Reading the html file and then sending it to the user. */
var readHTMLFile = function (path, callback) {
  fs.readFile(path, { encoding: "utf-8" }, function (err, html) {
    if (err) {
      callback(err);
      throw err;
    } else {
      callback(null, html);
    }
  });
};

/**
 * It reads the html file and then sends it to the user
 * @param email - The email address of the user.
 * @param subject - The subject of the email.
 * @param text - The text that you want to send to the user.
 */
const sendHtmlEmail = async (email, subject, text) => {
  try {
    let mailTransporter = nodemailer.createTransport(
      smtpTransport({
        host: process.env.HOST,
        service: process.env.SERVICE,
        port: 587,
        auth: {
          user: process.env.GMAILUSER,
          pass: process.env.PASS,
        },
      })
    );
   /* Reading the html file and then sending it to the user. */
    readHTMLFile(__dirname + "\\..\\public\\sanaat.html", function (err, html) {
      var template = handlebars.compile(html);
      var replacements = {
        verificationcode: text,
      };
      var htmlToSend = template(replacements);
      var mailOptions = {
        from: process.env.GMAILUSER,
        to: email,
        subject: subject,
        html: htmlToSend,
      };
      mailTransporter.sendMail(mailOptions, function (error, response) {
        if (error) {
          callback(error);
        }
      });
    });
  } catch (error) {
  }
};

module.exports = sendHtmlEmail;
