const fs = require('fs');
const path = require('path');

const lib = {};

lib.basedir = path.join(__dirname, '../.data/');

lib.create = (dir, file, data, callback) => {
	fs.open(
		`${lib.basedir + dir}/${file}.json`,
		'wx',
		function (err, fileDescriptor) {
			if (!err && fileDescriptor) {
				const stringData = JSON.stringify(data);

				fs.writeFile(fileDescriptor, stringData, (err) => {
					if (!err) {
						fs.close(fileDescriptor, (error) => {
							if (!error) {
								callback(false);
							} else {
								callback('error closing the new file');
							}
						});
					} else {
						callback('error writing new file');
					}
				});
			} else {
				callback(err);
			}
		}
	);
};

lib.read = (dir, file, callback) => {
	fs.readFile(`${lib.basedir + dir}/${file}.json`, 'utf8', (err, data) => {
		callback(err, data);
	});
};

lib.update = (dir, file, data, callback) => {
	fs.open(`${lib.basedir + dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
		if (!err && fileDescriptor) {
			const stringData = JSON.stringify(data);

			fs.ftruncate(fileDescriptor, (err) => {
				if (!err) {
					fs.write(fileDescriptor, stringData, (err) => {
						if (!err) {
							fs.close(fileDescriptor, (err) => {
								if (!err) {
									callback(false);
								} else {
									callback('Error closing file');
								}
							});
						} else {
							callback('error writing to file');
						}
					});
				} else {
					callback('error truncating file');
				}
			});
		} else {
			console.log('File may not existing');
		}
	});
};

lib.delete = (dir, file, callback) => {
	fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
		if (!err) {
			callback(false);
		} else {
			callback('error deleting file');
		}
	});
};

module.exports = lib;
