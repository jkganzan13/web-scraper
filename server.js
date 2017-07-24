let express    = require('express');
let app        = express();
global.fs      = require('fs');
global.request = require('request');
global.cheerio = require('cheerio');

let script;

try {
	script = process.argv[2];
	const scraper = require(`./scripts/${script}`).scraper;

	app.get('/scrape', scraper);
	app.listen('8081');
	console.log(`Module ${script} found. Go to http://localhost:8081/scrape to start.`);
} catch(e) {
	console.log(`Cannot find scraper script '${script}'.`)
}

exports = module.exports = app;
