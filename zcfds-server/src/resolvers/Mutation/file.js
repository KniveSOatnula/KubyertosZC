const upload = require('../../functions/upload');
const {getUserId} = require('../../functions/utils');

const file = {
	singleUpload(parent, {file}, ctx, info) {
		const userId = getUserId(ctx);
		return upload(file, ctx.db);
	},
	multipleUpload(parent, {files}, ctx, info) {
		const userId = getUserId(ctx);
		return Promise.all(files.map((file) => upload(file, ctx.db)))
	}
}

module.exports = { file }