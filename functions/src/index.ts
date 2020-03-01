import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.updateEvent = functions.firestore
  .document('projects/{projectId}/events/{eventId}')
  .onUpdate(async change => {
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(functions.config().sendgrid.key);
    const msg = {
      to: 'benjamin.mark.adam@gmail.com',
      from: 'benjamin.mark.adam@gmail.com',
      subject: 'Sending with Twilio SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>'
    };
    sgMail.send(msg);
  });
