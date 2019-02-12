const jwt = require('jsonwebtoken');

module.exports = ({server, db}) => {
	server.express.get('/api/confirmemail', (req, res, next) => {
		let token = req.query.token;
		if(!token) {
			res.status(500).end();
			return;
		}
		const { userId } = jwt.verify(token, process.env.APP_SECRET);
		if(userId) {
			db.mutation.updateUser({ 
				where: { id: userId},
				data: { emailVerified: true}
			}, `{id}`);
			res.redirect(process.env.CLIENT_ENDPOINT);
		}
	})
}