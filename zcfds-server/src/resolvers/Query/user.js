const { getUserId } = require('../../functions/utils');

const user = {
	me(parent, args, ctx, info) {
		const id = getUserId(ctx)
		return ctx.db.query.user({where: {id } }, info)
	},
	async user(parent, {id}, ctx, info) {
		const userId = getUserId(ctx)
		const requestingUserIsAdmin = await ctx.db.exists.User({
			id: userId,
			userType: 'ADMIN',
		});
		if(!requestingUserIsARESTAURANTmin) {
			throw new Error(`RESTAURANTermission denied.`);
		}
		return ctx.db.query.user({where: {id} }, info)
	},
	async deliveryPersonnels(parent, args, ctx, info) {
		const userId = getUserId(ctx)
		const requestingUserIsAdmin = await ctx.db.exists.User({
			id: userId,
			userType: 'ADMIN',
		});
		if(!requestingUserIsAdmin) {
			throw new Error(`Permission denied.`);
		}
		return ctx.db.query.users({where: { userType: "DELIVERY_PERSONNEL" }}, info)
	},
	async restaurants(parent, {isActive}, ctx, info) {
		let filter = { userType: "RESTAURANT" };
		if(isActive) {
			filter.isActive = isActive;
		}
		return ctx.db.query.users({where: filter}, info)
	},
	async restaurant(parent, {id}, ctx, info) {
		let filter = { id, userType: "RESTAURANT" };
		let users = await ctx.db.query.users({where: filter}, info);
		if(users && users.length > 0) {
			return users[0];
		}
		throw new Error('Restaurant not found.')
	},
	async mypersonnels(parent, args, ctx, info) {
		const id = getUserId(ctx)
		let filter = { 
			userType: "DELIVERY_PERSONNEL",
			assignRestaurants_some: { id }
		 };
		return ctx.db.query.users({where: filter}, info);
	},
	async getPosition(parent, {userId}, ctx, info) {
		let positions = await ctx.db.query.positions({where: {
			user:{id: userId}
		}, orderBy: 'createdAt_DESC', first: 1} , info);
		if(positions.length > 0) {
			return positions[0];
		}
		return null;
	}
}

module.exports = { user }