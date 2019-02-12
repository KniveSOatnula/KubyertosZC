const { getUserId } = require('../../functions/utils');

const menuItem = {
	async menuItems(parent, args, ctx, info) {
		const userId = getUserId(ctx);
		return ctx.db.query.menuItems({where: {user:{id: userId}}}, info);
	},
	async menuItem(parent, {id}, ctx, info) {
		return ctx.db.query.menuItem({where: {id}}, info);
	}
}

module.exports = { menuItem }