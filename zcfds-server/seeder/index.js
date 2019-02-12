require('dotenv').config();
const { Prisma } = require('prisma-binding');

const db = new Prisma({
	typeDefs: './generated/prisma/prisma.graphql',
	endpoint: process.env.PRISMA_ENDPOINT,
	debug: true,
	secret: process.env.PRISMA_SECRET
})

switch (process.argv[2]) {
	case '--all':
		//todo run all seeders
		break;
	case undefined:
		throw new Error('Missing argument. Please specify a seeder file.')
		break;
	default:
		let seeder = require('../'+process.argv[2]);
		seeder({db, args: process.argv});
		break;
}
