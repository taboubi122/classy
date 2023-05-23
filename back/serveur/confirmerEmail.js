const nodemailer = require("nodemailer");

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
 service:"Gmail",
  auth: {
    user: "classyy2023@gmail.com", // your email address
    pass: "sqobpmxusgwjheys", // your email password
  },
});

// send mail with defined transport object
module.exports.sendConfirmationEmail=(email,activeCode)=> {
  transporter.sendMail({
  from: 'classyy2023@gmail.com', // sender address
  to: email, // list of receivers
  subject: "Confirmation de votre compte", // Subject line
  html:`<h1>Email de confiramtion </h1><br/> Merci de confirmer votre compte en cliquant sur ce lien Fred Foo 👻 <br/>
   <b><a href=http://localhost:3000/confirm/${activeCode}>Cliquer ici !</a></b>`, // html body
})
.catch((err)=>console.log(err));
}
