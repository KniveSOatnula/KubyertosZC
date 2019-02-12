const { user } = require('./Query/user');
const { category } = require('./Query/category');
const { menuItem } = require('./Query/menu-item');
const { cart } = require('./Query/cart');
const { order } = require('./Query/order');

const Query = {
	...user,
	...category,
	...menuItem,
	...cart,
	...order
}

module.exports = { Query }