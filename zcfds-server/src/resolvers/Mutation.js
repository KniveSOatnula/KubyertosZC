const { auth } = require('./Mutation/auth');
const { user } = require('./Mutation/user');
const { file } = require('./Mutation/file');
const { category } = require('./Mutation/category');
const { menuItem } = require('./Mutation/menu-item');
const { cart } = require('./Mutation/cart');
const { order } = require('./Mutation/order');
const { position } = require('./Mutation/position');

const Mutation = {
	...auth,
	...user,
	...file,
	...category,
	...menuItem,
	...cart,
	...order,
	...position
}

module.exports = { Mutation }