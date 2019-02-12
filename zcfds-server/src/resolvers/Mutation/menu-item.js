const { getUser, getUserId } = require('../../functions/utils');

const menuItem = {
	async createMenuItem(parent, args, ctx, info) {
		const user =  await getUser(ctx, '{id, restaurant { id }}');
		const requestingUserIsResto = await ctx.db.exists.User({
			id: user.id,
			userType: 'RESTAURANT',
		});
		if(!requestingUserIsResto) {
			throw new Error(`Permission denied.`);
		}
		let data = {...args };
		data.restaurant = {connect: {
			id: user.restaurant.id
		}}
		data.user = {connect:{
				id: user.id
			}
		}
		if(args.thumbnail) {
			data.thumbnail = {connect: {id: args.thumbnail }}
		}
		if(args.categories) {
			data.categories = {
				connect: args.categories.map(name => {return {name}})
			}
		}
		return ctx.db.mutation.createMenuItem({data}, info);
	},
	async updateMenuItem(parent, args, ctx, info) {
		const userId = getUserId(ctx);
		const requestingUserIsResto = await ctx.db.exists.User({
			id: userId,
			userType: 'RESTAURANT',
		});
		if(!requestingUserIsResto) {
			throw new Error(`Permission denied.`);
		}
		let menuItem = await ctx.db.query.menuItem({where:{id: args.id}}, `{categories {id}, user { id }}`);
		if(userId !== menuItem.user.id) {
			throw new Error(`Permission denied.`);
		}
		let data = Object.assign({}, args);
		delete data.id;
		if(args.thumbnail) {
			data.thumbnail = {connect: {id: args.thumbnail }}
		}
		if(args.categories) {
			await ctx.db.mutation.updateMenuItem({
				where:{id: args.id}, 
				data:{categories:{disconnect: menuItem.categories}}},
			info);
			data.categories = {
				connect: args.categories.map(name => {return {name}})
			}
		}
		return ctx.db.mutation.updateMenuItem({where:{id: args.id},data}, info);
	},
	async deleteMenuItem(parent, args, ctx, info) {
		const userId = getUserId(ctx);
		const requestingUserIsOwner = await ctx.db.exists.MenuItem({
			id: args.id,
			user: {id: userId},
		});
		if(!requestingUserIsOwner) {
			throw new Error('Permission denied.');
		}
		return ctx.db.mutation.deleteMenuItem({where:{id: args.id}}, info);
	}
}

module.exports = { menuItem }