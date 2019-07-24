'use strict';

const AWS = require('aws-sdk');
const SES = new AWS.SES();

module.exports.staticSiteMailer = async event => {
  try {
    const emailParams = createEmailParams(event);
    const message = await SES.sendEmail(emailParams).promise();
    return generateReturn(200, message);
  } catch (err) {
    return generateReturn(500, err.message);
  }
};

const createEmailParams = event => {
  const formData = JSON.parse(event.body);

  return {
    Source: process.env.emailSource,
    ReplyToAddresses: [formData.email],
    Destination: {
      ToAddresses: [process.env.emailDestination],
    },
    Message: {
      Body: {
        Text: {
          Charset: 'UTF-8',
          Data: `Subject: ${formData.subject}\nMessage: ${formData.message}\n\nName: ${formData.name}\nEmail: ${formData.email}\nCompany: ${formData.company}`,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: process.env.emailSubject,
      },
    },
  };
}

const generateReturn = (code, message) => (
  {
    statusCode: code,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': process.env.allowOrigin,
    },
    body: JSON.stringify({
      message,
    }),
  }
);
