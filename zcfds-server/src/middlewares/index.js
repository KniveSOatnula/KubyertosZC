const confirmEmail = require('./confirm-email');
const bodyParser = require("body-parser");
const helmet = require('helmet');

module.exports = (args) => {
	const {server} = args;
	server.express.use(helmet());
	server.express.use(bodyParser.json());
	confirmEmail(args);
}