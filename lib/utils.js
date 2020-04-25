const nodemailer = require('nodemailer');
const sgTransport = require('nodemailer-sendgrid-transport');

const options = {
  auth: {
    api_user: process.env.SG_ID,
    api_key: process.env.SG_PASS,
  },
}

exports.mailer = nodemailer.createTransport(sgTransport(options));
