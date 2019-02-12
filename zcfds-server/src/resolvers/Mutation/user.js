const bcrypt = require('bcryptjs');
const { getUserId } = require('../../functions/utils');

const user = {
	async createUser(parent, args, ctx, info) {
		const userId = getUserId(ctx);
		const requestingUserExist = await ctx.db.exists.User({email: args.email});
		if(requestingUserExist) {
			throw new Error(`Email already in use.`);
		}
		const requestingUserIsAdmin = await ctx.db.exists.User({
			id: userId,
			userType: 'ADMIN',
		});
		if(!requestingUserIsAdmin) {
			throw new Error(`Permission denied.`);
		}
		const password = await bcrypt.hash(args.password, 10);
		let data = {...args, password };
		if(args.profilePicture) {
			data.profilePicture = {connect: {id: args.profilePicture }}
		}
		if(args.restaurant) {
			data.restaurant = {create: {
				...args.restaurant, 
				dayOfWeeks: {set: args.restaurant.dayOfWeeks}
			}}
		}
		if(args.assignRestaurants) {
			data.assignRestaurants = {connect: args.assignRestaurants.map(id => {return {id}})}
		}
		return ctx.db.mutation.createUser({data}, info);
	},
	async updateUser(parent, args, ctx, info) {
		const userId = getUserId(ctx);
		const requestingUserIsOwner = userId === args.id;
		const requestingUserIsAdmin = await ctx.db.exists.User({
			id: userId,
			userType: 'ADMIN'
		});
		if(requestingUserIsAdmin || requestingUserIsOwner) {
			let data = Object.assign({}, args);
			delete data.id;
			if(args.profilePicture){
				data.profilePicture = {connect: {id: args.profilePicture}}
			}
			if(args.restaurant) {
				data.restaurant = {update: {
					...args.restaurant, 
					dayOfWeeks: {set: args.restaurant.dayOfWeeks}
				}}
			}
			if(args.assignRestaurants) {
				let {assignRestaurants} = await ctx.db.query.user({where:{id: args.id}}, `{assignRestaurants {id}}`)
				await ctx.db.mutation.updateUser({
					where:{id: args.id},
					data:{assignRestaurants:{disconnect: assignRestaurants}}},
				info);
				data.assignRestaurants = {
					connect: args.assignRestaurants.map(id => {return {id}})
				}
			}
			if(args.password) {
				const password = await bcrypt.hash(args.password, 10);
				data.password = password;
			}
			return ctx.db.mutation.updateUser({
				where:{ id: args.id }, data
			}, info)
		}
		throw new Error(`Permission denied.`);
	}
}

module.exports = { user }