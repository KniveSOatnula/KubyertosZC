const shortid = require('shortid')
const  { createWriteStream, statSync } = require('fs');
const mkdirp  = require('mkdirp');
const uploadDir = './uploads';
mkdirp.sync(uploadDir);

const storeUpload = async ({ stream, filename }) => {
	const id = shortid.generate();
	const path = `${uploadDir}/${id}-${filename}`;
	return new Promise((resolve, reject) =>
	  stream
		.pipe(createWriteStream(path))
		.on('finish', () => {
			let stats = statSync(path)
			let size = stats["size"]
			resolve({ id, path, size })}
		)
		.on('error', reject),
	)
}

const upload = async (file, db) => {
	const { stream, filename, mimetype } = await file
	const { path, size } = await storeUpload({ stream, filename });
	const contentType = mimetype;
	const name = filename;
	const url = path.substring(1);
	try {
		const data = {
			name: filename,
			size,
			contentType,
			url
		}
		const { id } = await db.mutation.createFile({ data }, ` { id } `);
		const file = {
			id,
			name,
			contentType,
			size,
			url
		}
		return file;
	} catch(err) {
		console.log(err);
		throw new Error('Failed to upload.');
	}
}

module.exports = upload;