const { getUserId } = require('../../functions/utils');

const position = {
	async createPosition(parent, {latitude, longitude}, ctx, info) {
		const userId = getUserId(ctx);
		return ctx.db.mutation.createPosition({data: {
			latitude, longitude, user:{connect:{id: userId}}
		}}, info);
	}
}

module.exports = { position }