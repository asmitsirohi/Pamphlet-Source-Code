const nodemailer = require("nodemailer");
const mailAuth = require("../utils/mailAuth");

const sendmail = async (email,subject, body, callback) => {
  //NODEMAILER SPECIFIC STUFF
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: mailAuth.username,
      pass: mailAuth.password,
    },
  });

  let mailOptions = {
    from: "Pamphlet<>noreply@gmail.com",
    to: email,
    // bcc: "asmitsirohi9761@gmail.com",
    subject: subject,
    html: body,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    callback(error);
  });
};

module.exports = sendmail;
