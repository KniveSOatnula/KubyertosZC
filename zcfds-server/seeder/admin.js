const bcrypt = require('bcryptjs');

let admins = [
	{
		email: "jester.temporada@gmail.com",
		password: "nopassword",
		firstname: "Jester",
		lastname: "Temporada",
		userType: "ADMIN",
	},
	{
		email: "kevin.saluntao@gmail.com",
		password: "nopassword",
		firstname: "Kevin",
		lastname: "Saluntao",
		userType: "ADMIN"
	},
	{
		email: "tristan.arcangel@gmail.com",
		password: "nopassword",
		firstname: "Tristan Elliot",
		lastname: "Arcangel",
		userType: "ADMIN"
	}
]

module.exports = async ({db}) => {
	await db.mutation.deleteManyUsers({where:{userType:"ADMIN"}});
	for (const o of admins) {
		let password = await bcrypt.hash(o.password, 10);
		let result = await db.mutation.createUser({data:{...o, password}});
		console.log(result);
	}
}