const { getUserId } = require('../../functions/utils');

const cart = {
	async cart(parent, args, ctx, info) {
		const userId = getUserId(ctx);
		let cartItems = await ctx.db.query.carts({where:{user:{id: userId}}}, info);
		if(cartItems && cartItems.length > 0) {
			return cartItems[0];
		}
		return null;
	}
}

module.exports = { cart }