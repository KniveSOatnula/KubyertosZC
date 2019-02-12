const category = {
	async categories(parent, {id}, ctx, info) {
		return ctx.db.query.categories(null, info);
	},
	async category(parent, {id}, ctx, info) {
		return ctx.db.query.category({where: {id}}, info);
	}
}

module.exports = { category }