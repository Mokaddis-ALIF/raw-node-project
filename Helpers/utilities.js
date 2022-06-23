const crypto = require('crypto');
const environments = require('./environments');

const utilities = {};

utilities.parseJSON = (jsonString) => {
	let output;

	try {
		output = JSON.parse(jsonString);
	} catch {
		output = {};
	}

	return output;
};

utilities.hash = (str) => {
	if (typeof str === 'string' && str.length > 0) {
		const hash = crypto
			.createHmac('sha256', environments.secretKey)
			.update(str)
			.digest('hex');
		return hash;
	} else {
		return false;
	}
};

utilities.createRandomStr = (strLength) => {
	let length = strLength;
	length = typeof strLength === 'number' && strLength > 0 ? strLength : false;

	if (length) {
		const possibleCharacters = 'abcdefghijklmnopqrstuvwxyz1234567890';

		let output = '';
		for (let i = 0; i <= length; i++) {
			const randomCharacter = possibleCharacters.charAt(
				Math.floor(Math.random() * possibleCharacters.length)
			);
			output += randomCharacter;
		}

		return output;
	} else {
		return false;
	}
};

module.exports = utilities;
