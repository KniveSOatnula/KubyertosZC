const axios = require('axios');
const querystring = require('querystring');
require('dotenv').config();

const sms = async (mobile, txt) => {
	axios.post(process.env.SMS_URL, querystring.stringify({
		apikey: process.env.SMS_API_KEY,
		number: mobile,
		message: txt,
		sendername: `KUBYERTOS`
	})).then(function (response) {
		console.log(response);
	})
	.catch(function (error) {
		console.log(error.message);
	});
}

module.exports = sms;