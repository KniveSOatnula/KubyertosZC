const { getUser } = require('../../functions/utils');
const sms = require('../../functions/sms');

const order = {
	async checkout(parent, {address}, ctx, info) {
		const user = await getUser(ctx, `{ id, cart { id, restaurant { id } cartItems { 
			id, quantity, specialInstruction, menuItem { id, price, description, thumbnail {id}, categories { id } } } } 
		}`);
		if(user.cart && user.cart.cartItems.length < 1) {
			throw new Error('Cart is empty.');
		}
		let order = await ctx.db.mutation.createOrder({
			data: {
				address,
				status: 'PENDING',
				client: {connect: {id: user.id}},
				restaurant: {connect:{id: user.cart.restaurant.id}},
				items: {
					create: user.cart.cartItems.map(o => {
						return {
							price: o.menuItem.price,
							description: o.menuItem.description,
							specialInstruction: o.specialInstruction,
							thumbnail: {connect: {id: o.menuItem.thumbnail.id}},
							categories: {connect: o.menuItem.categories},
							user: {connect: {id: user.id}},
							quantity: o.quantity
						}
					})
				}
			}
		}, info);
		if(order) {
			return ctx.db.mutation.updateCart({
				where: {id: user.cart ? user.cart.id : ''},
				data: {
					cartItems: {
						delete: user.cart.cartItems.map(o => { return {id: o.id} })
					}
				}
			}, info)
		}
		throw new Error('Failded to create order.');
	},
	async acceptOrder(parent, {id}, ctx, info) {
		const user = await getUser(ctx, `{ userType }`);
		if(user.userType !== 'RESTAURANT') {
			throw new Error('Permission denied.');
		}
		return ctx.db.mutation.updateOrder({
			where:{id},
			data:{
				status: 'TO_PREPARE'
			}
		}, info);
	},
	async orderPrepared(parent, {id, deliveryPersonnelId}, ctx, info) {
		const user = await getUser(ctx, `{ userType, restaurant { name } }`);
		if(user.userType !== 'RESTAURANT') {
			throw new Error('Permission denied.');
		}
		
		let order = await ctx.db.mutation.updateOrder({
			where:{id},
			data:{
				status: 'TO_PICK_UP',
				deliveryPersonnel: {connect: {id: deliveryPersonnelId}}
			}
		}, `{ id, client { firstname, lastname }, deliveryPersonnel { phoneNumber }}`);
		if(!order) {
			throw new Error('Failed to update order.');
		}
		sms(order.deliveryPersonnel.phoneNumber, `Order for pickup requested by ${user.restaurant.name} for ${order.client.firstname} ${order.client.lastname}. [Order Id: ${order.id}]`);
		return ctx.db.query.order({where:{id}}, info);
	},
	async orderPickedUp(parent, {id}, ctx, info) {
		const user = await getUser(ctx, `{id, userType, firstname, lastname }`);
		if(user.userType !== 'DELIVERY_PERSONNEL') {
			throw new Error('Permission denied.');
		}
		let order = await ctx.db.query.order({where:{id}}, `{ 
			id,
			client { phoneNumber }, 
			restaurant { restaurant { name } }
		}`);
		if(order) {
			const {client, restaurant} = order;
			sms(client.phoneNumber, `Your order from ${restaurant.restaurant.name} has been picked up by ${user.firstname} ${user.lastname}. [Order Id: ${order.id}]`);
		}
		return ctx.db.mutation.updateOrder({
			where:{id},
			data:{
				status: 'TO_DELIVER',
			}
		}, info);
	},
	async orderDelivered(parent, {id}, ctx, info) {
		const user = await getUser(ctx, `{ userType }`);
		if(user.userType !== 'DELIVERY_PERSONNEL') {
			throw new Error('Permission denied.');
		}
		return ctx.db.mutation.updateOrder({
			where:{id},
			data:{
				status: 'COMPLETED'
			}
		}, info);
	},
	async cancelOrder(parent, {id}, ctx, info) {
		const user = await getUser(ctx, `{ userType }`);
		if(user.userType !== 'CLIENT' && user.userType !== 'RESTAURANT') {
			throw new Error('Permission denied.');
		}
		return ctx.db.mutation.updateOrder({
			where:{id},
			data:{
				status: 'CANCELLED'
			}
		}, info);
	},
}

module.exports = { order }