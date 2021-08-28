/* eslint-disable no-unreachable */
/* eslint-disable import/prefer-default-export */
import sgMail from '@sendgrid/mail';

export const sendEmail = (emailInfo, targetDate) => {
  const msg = {
    to: emailInfo.to,
    from: 'sigma.nu@dartmouth.edu', // Use the email address or domain you verified above
    subject: `Cleans bump: ${targetDate}`,
    html: `<p> ${emailInfo.body} </p>`,
  };
  console.log(`sending the email to ${emailInfo.to} about cleaning ${emailInfo.body} on ${targetDate}`);
  //   sgMail
  //     .send(msg)
  //     .then(() => {}, (error) => {
  //       console.error(error);

//       if (error.response) {
//         console.error(error.response.body);
//       }
//     });
};
