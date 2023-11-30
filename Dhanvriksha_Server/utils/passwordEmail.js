var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
var handlebars = require("handlebars");
var fs = require("fs");

/* Reading the html file and passing it to the callback function. */
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
 * It takes in an email, subject and text and sends an email to the email address with the subject and
 * text
 * @param email - The email address of the user
 * @param subject - The subject of the email.
 * @param text - The text that you want to send in the email.
 */
const passwordEmail = async (email, subject, text) => {
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
    readHTMLFile(__dirname + "/../public/passwordInMail.html", function (err, html) {
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
        }
      });
    });
  } catch (error) {
  }
};

/* Exporting the function passwordEmail so that it can be used in other files. */
module.exports = passwordEmail;
