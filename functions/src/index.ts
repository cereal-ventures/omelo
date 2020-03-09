import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.sendProjectInvite = functions.firestore
  .document('invites/{inviteId}')
  .onCreate(async doc => {
    if (doc.exists) {
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(functions.config().sendgrid.key);
      const invite = doc.data();
      const url = `${functions.config().url.base}?invite=${
        doc.id
      }&name=${encodeURI(invite?.projectName || '')}`;
      const msg = {
        to: invite?.email,
        from: 'hello@omelo.com',
        subject: 'You have been invited to join a project on Omelo.com',
        text: `You have been invited to a project: ${url}`,
        html: `You have been invited to a project: <a href=${url} target='_blank'>Accept invite</a>`
      };
      sgMail.send(msg);
    }
  });
