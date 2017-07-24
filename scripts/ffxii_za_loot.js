let request = require('request');
let cheerio = require('cheerio');

exports.scraper = function(req, res){
	const url = 'http://finalfantasy.wikia.com/wiki/Loot_(Final_Fantasy_XII)';

	request(url, function(error, response, html){
		if(!error) {
			let $ = cheerio.load(html);

			/**
			 const schema = {
				name,
				price,
				drop,
				monograph_drop,
				steal,
				poach,
				reward,
			 }
			 * **/
			const getName = item => item.children().first().text().replace('\n','');
			const getPrice = item => item.eq(1).text().replace('\n','');
			const getDrops = (item, $) => item.eq(2).children().map(function() {
				return $(this).text()
			}).get();
			const getMonographDrops = (item, $) => item.eq(3).children().map(function() {
				return $(this).text()
			}).get();
			const getSteal = (item, $) => item.eq(4).children().map(function() {
				return $(this).text()
			}).get();
			const getPoach = (item, $) => item.eq(5).children().map(function() {
				return $(this).text()
			}).get();
			const getRewards = (item, $) => item.eq(6).children().map(function() {
				return $(this).text()
			}).get();

			const json = [];

			$('.full-width.table.FFXII').filter(function() {
				const table = $(this);
				const tbody = table.children().first();
				const rows = tbody.children();

				let counter = 0;

				rows.each(function(row) {
					if(row > 0 && counter === 0) {
						const item = $(this).children();
						const name = getName(item);
						const price = getPrice(item);
						const drop = getDrops(item, $);
						const monograph_drop = getMonographDrops(item, $);
						const steal = getSteal(item, $);
						const poach = getPoach(item, $);
						const reward = getRewards(item, $);

						json.push({
							name,
							price,
							drop,
							monograph_drop,
							steal,
							poach,
							reward,
						});
					}
					if (row > 0) counter++;
					if (counter === 3) counter = 0;
				});
			});

			fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
				console.log('File successfully written!');
			});

			res.send('Check your project directory for the output.json file!');
		}
	});
}