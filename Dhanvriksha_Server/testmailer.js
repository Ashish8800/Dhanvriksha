const nodemailer = require("nodemailer");

/* Creating a transporter object using the default SMTP transport. */
let mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "inevitableapptest@gmail.com",
    pass: "Info@123",
  },
});

/* This is the mail object which contains the details of the mail. */
let mailDetails = {
  from: "inevitableapptest@gmail.com",
  to: "anil.intelizign@gmail.com",
  subject: "Test mail",
  text: "Node.js testing mail for GeeksforGeeks",
};

/* This is the callback function which is called when the mail is sent. */
mailTransporter.sendMail(mailDetails, function (err, data) {
  if (err) {
  } else {
  }
});
