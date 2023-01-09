/* eslint-disable import/prefer-default-export */
import sgMail from '@sendgrid/mail';

export const sendEmail = (emailInfo, targetDate) => {
  if (!emailInfo?.body || !emailInfo?.to || !targetDate) {
    return;
  }
  const msg = {
    to: emailInfo.to,
    from: 'sigmacleans@gmail.com', // Use the email address or domain you verified above
    subject: `Cleans bump: ${targetDate}`,
    html: `<p> ${emailInfo.body} </p>`,
  };
  console.log(`sending the email to ${emailInfo.to} about cleaning ${emailInfo.body} on ${targetDate}`);
  sgMail
    .send(msg)
    .then(() => {}, (error) => {
      console.log('sent!');

      if (error.response) {
        console.error(error.response.body);
      }
    });
};
