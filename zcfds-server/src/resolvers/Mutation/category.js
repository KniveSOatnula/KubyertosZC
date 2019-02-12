const { getUserId } = require('../../functions/utils');

const category = {
	async createCategory(parent, {name}, ctx, info) {
		const userId = getUserId(ctx);
		const requestingUserIsAdmin = await ctx.db.exists.User({
			id: userId,
			userType: 'ADMIN',
		});
		if(!requestingUserIsAdmin) {
			throw new Error(`Permission denied.`);
		}
		return ctx.db.mutation.createCategory({data: {name}}, info);
	},
	async updateCategory(parent, args, ctx, info) {
		const userId = getUserId(ctx);
		const requestingUserIsAdmin = await ctx.db.exists.User({
			id: userId,
			userType: 'ADMIN',
		});
		if(!requestingUserIsAdmin) {
			throw new Error(`Permission denied.`);
		}
		let data = Object.assign({}, args);
		delete data.id;
		return ctx.db.mutation.updateCategory({where:{id: args.id}, data}, info);
	}
}

module.exports = { category }