'use strict';

const AWS = require('aws-sdk');
const SES = new AWS.SES();

module.exports.staticSiteMailer = async event => {

  const emailParams = createEmailParams(event);

  const {statusCode, headers, message} = await sendEmail(emailParams);

  return {
    statusCode,
    headers,
    body: JSON.stringify({
      message,
    }),
  }
};

const createEmailParams = event => {
  const formData = JSON.parse(event.body);
  const emailParams = {
    Source: 'chris@dickinson.ch',
    ReplyToAddresses: [formData.email],
    Destination: {
      ToAddresses: ['chris@dickinson.ch'],
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
        Data: 'New message from chris.dickinson.ch',
      },
    },
  };
  return emailParams;
}

const sendEmail = async emailParams => {

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'https://chris.dickinson.ch',
  }

  try {
    const message = await SES.sendEmail(emailParams).promise();
    return {
      statusCode: 200,
      headers,
      message,
    }
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      message: err.message,
    }
  }
}