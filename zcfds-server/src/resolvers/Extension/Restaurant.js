const Restaurant = {
	async categories({id}, args, ctx, info) {
		if(!id) {
			throw new Error('Id field required in subselection.')
		}
		let categories = [];
		let menuItems = await ctx.db.query.menuItems({where:{restaurant:{id}}}, '{categories {name}}')
		for (const m of menuItems) {
			for (const o of m.categories) {
				if(!categories.includes(o.name)) {
					categories.push(o.name);
				}
			}
		}
		return categories.sort();
	},
	async priceRange({id}, args, ctx, info) {
		if(!id) {
			throw new Error('Id field required in subselection.')
		}
		let priceRange = [];
		let menuItems = await ctx.db.query.menuItems({where:{restaurant:{id}}, orderBy: 'price_ASC'}, '{price}');
		if(menuItems && menuItems.length > 0) {
			priceRange.push(menuItems[0].price);
		}
		if(menuItems && menuItems.length > 1) {
			priceRange.push(menuItems[menuItems.length - 1].price);
		}
		return priceRange;
	}
}

module.exports = { Restaurant }