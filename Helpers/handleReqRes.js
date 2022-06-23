const { StringDecoder } = require('string_decoder');
const url = require('url');
const routes = require('../routes');
const {
	notFoundHandler,
} = require('../handlers/routehandlers/NotfoundHanlder');
const { parseJSON } = require('../Helpers/utilities');

const handler = {};

handler.handleReqRes = (req, res) => {
	const parsedUrl = url.parse(req.url, true);
	const path = parsedUrl.pathname;
	const trimmedPath = path.replace(/^\/+|\/+$/g, '');
	const method = req.method.toLowerCase();
	const queryStringObject = parsedUrl.query;
	const headersObject = req.headers;

	const requestProperties = {
		parsedUrl,
		path,
		trimmedPath,
		method,
		queryStringObject,
		headersObject,
	};

	const decoder = new StringDecoder('utf-8');
	let realData = '';

	const chooseHandler = routes[trimmedPath]
		? routes[trimmedPath]
		: notFoundHandler;

	req.on('data', (buffer) => {
		realData += decoder.write(buffer);
	});

	req.on('end', () => {
		realData += decoder.end();

		requestProperties.body = parseJSON(realData);

		chooseHandler(requestProperties, (statusCode, payload) => {
			statusCode = typeof statusCode === 'number' ? statusCode : 500;
			payload = typeof payload === 'object' ? payload : {};

			const payloadString = JSON.stringify(payload);

			res.writeHead(statusCode);
			res.end(payloadString);
		});

		res.end('Hello, world!');
	});
};

module.exports = handler;
