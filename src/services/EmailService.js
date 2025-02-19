const domain = 'http://trial-yzkq3406n004d796.mlsender.net';
const token = 'mlsn.00128de4f6622b9aa5014fcf0d2f09771fffcca9f86a53c875f437d0abbfe15a';
const admin = 'MS_5gPdgL@trial-yzkq3406n004d796.mlsender.net';
const password = 'mssp.4qOYJOh.0p7kx4x9j5749yjr.lLJ4vN6';
const server = 'http://smtp.mailersend.net';
const port = 3000;
const securityConnection = 'TLS';

const {MailerSend, EmailParams, Sender, Recipient} = require('mailersend');
const mailerSend = new MailerSend({
    apiKey: token
});

const sendEmail = async (email, name, title, message) => {
    try {
        const sentFrom = new Sender('MS_5gPdgL@trial-yzkq3406n004d796.mlsender.net', 'Administrador');
        const recipients = [
            new Recipient('maria@rodriguezcoto.com')
        ];

        const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setSubject(title)
        await mailerSend.email.send(emailParams);
        return true;
    } catch (error) {
        console.error('Error enviando el correo', error);
        return false;
    }
};

const sendTemporaryPassword = async(email, name, temporaryPassword) => {
    sendEmail(
        email,
        name,
        'Temporary Password to access Flickr Image Browser',
        'Your temporary password is:' + temporaryPassword
    )
};

const sendOTP = async(email, name, otp) => {
    sendEmail(
        email,
        name,
        'Verification Code to access Flickr Image Browser',
        'Your verification code is:' + otp
    )
}

module.exports = {sendTemporaryPassword, sendOTP}