const { getUser } = require('../../functions/utils');

const order = {
	async orders(parent, args, ctx, info) {
		const user = await getUser(ctx, `{ id, userType, assignRestaurants { id } }`);
		let filter = {};
		if(user.userType === 'CLIENT') {
			filter = {
				client: {id: user.id}
			}
		}
		else if(user.userType === 'RESTAURANT') {
			filter = {
				restaurant: {id: user.id}
			}
		}
		else if(user.userType === 'DELIVERY_PERSONNEL') {
			filter = {
				deliveryPersonnel: {id: user.id},
				status_in: ['TO_PICK_UP', 'TO_DELIVER', 'CANCELLED', 'COMPLETED']
			}
		}
		return ctx.db.query.orders({
			where: filter,
			orderBy: 'createdAt_DESC'
		}, info)
	}
}

module.exports = { order }