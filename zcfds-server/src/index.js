const { Prisma } = require('prisma-binding');
const { GraphQLServer } = require('graphql-yoga');
const resolvers = require('./resolvers');
const path = require('path'); 
const express = require('express');
const middlewares = require('./middlewares');
require('dotenv').config({ path: path.join(__dirname, '../', '.env') });

const db = new Prisma({
	typeDefs: './generated/prisma/prisma.graphql',
	endpoint: process.env.PRISMA_ENDPOINT,
	debug: true,
	secret: process.env.PRISMA_SECRET
})

const server = new GraphQLServer({
	typeDefs: './src/schema.graphql',
	resolvers,
	resolverValidationOptions: {
		requireResolversForResolveType: false
	},
	context: req => ({ ...req, db })
})

middlewares({server, db});

const options = {
	port: process.env.PORT || 4060,
	endpoint: '/api/graphql',
	subscriptions: '/api/subscriptions',
	playground: '/api/playground'
}

server.express.use('/uploads', express.static('uploads'));
server.express.use(express.static('public'));

let pathname = path.resolve(__dirname, '../') + '/public';

server.get(/^((?!api).)*$/, (req, res, next) => {
	res.sendFile(pathname + '/index.html');
})

server.start(options, ({ port }) =>
	console.log(
		`Server started, listening on port ${port} for incoming requests.`
	)
)