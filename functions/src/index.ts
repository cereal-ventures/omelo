import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.sendWelcomeEmail = functions.auth.user().onCreate(user => {
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(functions.config().sendgrid.key);
  const msg = {
    to: user?.email,
    from: 'hello@omelo.com',
    subject: 'Welcome to Omelo',
    html: `Welcome to Omelo`,
    templateId: 'd-8453e2f2d9854aebab1372a8e15f8088',
    dynamic_template_data: {
      name: user?.displayName,
      url: 'https://beta.omelo.com'
    }
  };
  sgMail.send(msg);
});

exports.sendProjectInvite = functions.firestore
  .document('invites/{inviteId}')
  .onCreate(async doc => {
    if (doc.exists) {
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(functions.config().sendgrid.key);
      const invite = doc.data();
      const isViewer = invite?.permission === 'viewer';
      const url = isViewer
        ? `${functions.config().url.base}/public/${invite?.projectId}`
        : `${functions.config().url.base}?invite=${doc.id}&name=${encodeURI(
            invite?.projectName || ''
          )}`;

      const msg = {
        to: invite?.email,
        from: 'hello@omelo.com',
        subject: `You have been invited to join ${invite?.projectName ||
          'a project'} on Omelo.com`,
        text: `You have been invited to ${invite?.projectName ||
          'a project'} : ${url}`,
        html: `You have been invited to ${invite?.projectName ||
          'a project'} : <a href="${url}" target="_blank">Accept invite</a>`,
        templateId: 'd-b697cb305e224eacac7e88a2c364950c',
        dynamic_template_data: {
          sender: invite?.sender,
          projectName: invite?.projectName,
          url
        }
      };

      sgMail.send(msg);
    }
  });
