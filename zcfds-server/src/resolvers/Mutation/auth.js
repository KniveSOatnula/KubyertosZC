const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {welcomeMailer} = require('../../functions/mailer');
const confirmEmail = require('../../email_templates/verifyemail');

const auth = {
	async signup(parent, args, ctx, info) {
		const userExist = await ctx.db.query.user({where: {email: args.email}});
		if(userExist) {
			throw new Error(`Email already in use.`);
		}
		const password = await bcrypt.hash(args.password, 10);
		const user = await ctx.db.mutation.createUser({
			data: { 
				...args, 
				password,
				userType: "CLIENT"
			}
		});
		let token = jwt.sign({ userId: user.id }, process.env.APP_SECRET, {expiresIn: '24hr'});
		if(user) {
			let mailOptions = {
				from: '"Kubyertos" <msmcoders@gmail.com>',
				to: user.email,
				subject: 'Welcome',
				html: confirmEmail(user.firstname, `${process.env.SERVER_ENDPOINT}/api/confirmemail?token=${token}`)
			};
			welcomeMailer(mailOptions);
		}
		return {
			token,
			user
		}
	},
	async login(parent, { email, password }, ctx, info) {
		const user = await ctx.db.query.user({ where: {email} });
		if (!user || !user.isActive) {
			throw new Error(`Invalid email or password`);
		}
		if(user.userType === 'CLIENT' && !user.emailVerified) {
			let token = jwt.sign({ userId: user.id }, process.env.APP_SECRET, {expiresIn: '24hr'});
			let mailOptions = {
				from: '"Kubyertos" <msmcoders@gmail.com>',
				to: user.email,
				subject: 'Welcome',
				html: confirmEmail(user.firstname, `${process.env.SERVER_ENDPOINT}/api/confirmemail?token=${token}`)
			};
			welcomeMailer(mailOptions);
			throw new Error(`Please verify email`);
		}
		const valid = await bcrypt.compare(password, user.password);
		if (!valid) {
			throw new Error('Invalid email or password');
		}
		return {
			token: jwt.sign({ userId: user.id }, process.env.APP_SECRET),
			user
		}
	}
}

module.exports = { auth }