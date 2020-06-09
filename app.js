const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
const auth = require('./config/credientials')

const app = express();

//Static folder
app.use(express.static(path.join(__dirname, 'public')));

//View engine middleware
app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')

//Body parser middleware
app.use(bodyParser.urlencoded({urlencoded: false}));
app.use(bodyParser.json());

//Route
app.get('/', (req,res) => {
    res.render('contact', {layout:false})
})

app.post('/send', (req,res) => {
    const output = `
    <p>You have a new contact request.</p>
    <h3>Contact Details</h3>
    <ul>
        <li>Name: ${req.body.name}</li>
        <li>Company :  ${req.body.company}</li>
        <li>Email:  ${req.body.email}</li>
        <li>Phone:  ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>    
    `
    // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.mail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth
  });

  // send mail with defined transport object
  let info = transporter.sendMail({
    from: '"Ömer Kılıç" <omerbkk06@mail.com>', // sender address
    to: "omerbkk06@gmail.com", // list of receivers
    subject: "Contact request", // Subject line
    text: "Contact request", // plain text body
    html: output, // html body
    tls:{
        rejectUnauthorized:false
      }
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  res.render('contact', {layout:false, msg: 'Email has sent...'})
})

app.listen(3000, () => console.log('Server started on port 3000.'));