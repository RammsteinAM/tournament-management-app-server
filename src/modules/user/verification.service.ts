import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
    to: 'rammsteinam@gmail.com',
    from: 'avet@simplytechnologies.net', // Use the email address or domain you verified above
    subject: 'Sending with Twilio SendGrid is KEKW',
    text: 'and easy to do anywhere, even with Node.js KEKWait',
    html: '<strong>and easy to do anywhere, even with Node.js KEKWait</strong>',
};

export const sendMail = async () => {
    try {
        await sgMail.send(msg);
    } catch (error) {
        console.error(error);

        if (error.response) {
            console.error(error.response.body)
        }
    }
};