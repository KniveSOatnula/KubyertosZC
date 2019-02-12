const nodemailer = require('nodemailer');

const welcomeMailer = (mailOptions) => {
	let account = {
		user: process.env.WELCOME_ACCOUNT_EMAIL,
		pass: process.env.WELCOME_ACCOUNT_PASSWORD
	}
	return  mailer(account, mailOptions);
}

const supportMailer = (mailOptions) => {
	let account = {
		user: process.env.SUPPORT_ACCOUNT_EMAIL,
		pass: process.env.SUPPORT_ACCOUNT_PASSWORD
	}
	return mailer(account, mailOptions);
}

const notificationMailer = (mailOptions) => {
	let account = {
		user: process.env.NOTIF_ACCOUNT_EMAIL,
		pass: process.env.NOTIF_ACCOUNT_PASSWORD
	}
	return mailer(account, mailOptions);
}

const mailer = (account, mailOptions) => {
	let transporter = nodemailer.createTransport({
		service:'Gmail',
		host: 'smtp.gmail.com',
		port: 587,
		secure: false, // true for 465, false for other ports
		auth: {
			user: account.user,
			pass: account.pass
		}
	});
	return new Promise((resolve, reject) => {
		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				console.log(error);
				throw new Error("Failed to send email.");
				reject(error);
			}
			console.log('Message sent: %s', info.messageId);
			resolve(info.messageId);
		});
	});
}

module.exports = { mailer, welcomeMailer, supportMailer, notificationMailer }