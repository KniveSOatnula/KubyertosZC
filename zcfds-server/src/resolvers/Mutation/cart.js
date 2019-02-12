const { getUser } = require('../../functions/utils');

const cart = {
	async addToCart(parent, {restaurant, menuItem, quantity, specialInstruction}, ctx, info) {
		const user = await getUser(ctx, `{ id, cart { id, restaurant { id } cartItems { id, quantity, menuItem { id } } } }`);
		if(user.cart && user.cart.restaurant.id !== restaurant) {
			await ctx.db.mutation.updateCart({
				where: {id: user.cart ? user.cart.id : ''},
				data: {
					cartItems: {
						deleteMany: [{id_not: null}]
					}
				}
			})
		}
		let cartItem = null;
		if(user.cart) {
			cartItem = user.cart.cartItems.find(o => o.menuItem.id === menuItem);
		}
		return ctx.db.mutation.upsertCart({
			where: {id: user.cart ? user.cart.id : ''},
			create: {
				user:{connect:{id: user.id}},
				restaurant:{connect:{id: restaurant}},
				cartItems: {create:[{
					specialInstruction,
					quantity: quantity,
					menuItem: {connect: {id: menuItem}}
				}]}
			},
			update: {
				restaurant:{connect:{id: restaurant}},
				cartItems: {
					upsert: {
						where:{
							id: cartItem ? cartItem.id : ''
						},
						update:{
							specialInstruction,
							quantity: cartItem ? cartItem.quantity + quantity : 1,
							menuItem: {connect: {id: menuItem}}
						},
						create:{
							specialInstruction,
							quantity: quantity,
							menuItem: {connect: {id: menuItem}}
						}
					}
				}
			}
		}, info)
	},
	async removeFromCart(parent, {menuItem}, ctx, info) {
		const user = await getUser(ctx, `{ id, cart { id, cartItems { id, menuItem { id } } } }`);
		let cartItem = null;
		if(user.cart) {
			cartItem = user.cart.cartItems.find(o => o.menuItem.id === menuItem);
		}
		if(!cartItem) {
			throw new Error('Not found.');
		}
		return ctx.db.mutation.updateCart({
			where: {id: user.cart ? user.cart.id : ''},
			data: {
				cartItems: {
					delete: [{id: cartItem.id}]
				}
			}
		}, info)
	}
}

module.exports = { cart }