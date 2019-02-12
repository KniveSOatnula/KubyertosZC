const jwt = require('jsonwebtoken');

const getPayload = (ctx) => {
	const Authorization = ctx.request.get('Authorization')
	if (Authorization) {
		const token = Authorization.replace('Bearer ', '')
		return jwt.verify(token, process.env.APP_SECRET);
	}
	throw new AuthError()
}

const getToken = (ctx) => {
	const Authorization = ctx.request.get('Authorization')
	if (Authorization) {
		const token = Authorization.replace('Bearer ', '')
		jwt.verify(token, process.env.APP_SECRET);
		return token;
	}
	throw new AuthError()
}

const getUserId = (ctx) => {
	const Authorization = ctx.request ? ctx.request.get('Authorization') : ctx.connection.context.Authorization;
	if (Authorization) {
		const token = Authorization.replace('Bearer ', '')
		const { userId } = jwt.verify(token, process.env.APP_SECRET)
		return userId
	}
	throw new AuthError()
}

const getUser = async (ctx, info) => {
	const userId = getUserId(ctx);
	if(!info) {
		info = `{ id, emailVerified, firstName, lastName }`;
	}
	const user = await ctx.db.query.user({ where: { id: userId } }, info);
	return user;
}

class AuthError extends Error {
	constructor() {
		super('Not authorized')
	}
}

module.exports = {
	getUserId,
	getUser,
	getPayload,
	getToken,
	AuthError
}