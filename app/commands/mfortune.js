
const myGlobals = require('../globals.js');
const hook = myGlobals.hook;
const DBot = myGlobals.DBot;
const fs = require('fs');

/*
const unirest = require('unirest');
const grabber = new RegExp('style="display: none">([^<]+)</span>', 'gi');
const base = 'http://www.twitchquotes.com/copypastas?page=';
let page = 1;

const updateFunc = function() {
	console.log('Fetching twitchquotes.com; page: ' + page);
	
	unirest.get(base + page)
	.headers({'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.100 Safari/537.36 Vivaldi/1.5.658.56'})
	.end(function(res) {
		let matches = res.raw_body.match(grabber);
		
		if (!matches)
			return;
		
		let potential = matches.length;
		let count = matches.length;
		
		if (potential == 0)
			return;
		
		for (let m of matches) {
			let text = m.substr(22, m.length - 30);
			let esc = Postgres.escape(text.replace(/\\/g, ''));
			
			Postgre.query('SELECT "ID" FROM mfortune WHERE "TEXT" = ' + esc, function(err, data) {
				if (err) {
					console.error(err);
					potential--;
					count--;
					return;
				}
				
				if (data && data[0]) {
					potential--;
				} else {
					Postgre.query('INSERT INTO mfortune ("TEXT") VALUES (' + esc + ')');
				}
				
				count--;
				
				if (count == 0) {
					if (potential == 0) {
						console.log('Stopped fetching twitchquotes.com; no more unique quotes!');
						return; // No more quotes!
					}
					
					page++;
					
					setTimeout(updateFunc, 5000);
				}
			});
		}
	});
}

updateFunc();
*/

const uniqueStr = '\0\0\0\0\0\0\1\1\1\1\1\0\0\1\0\1\0\1';
const fileContents = fs.readFileSync('./resource/copypasta.csv', 'utf8').replace(/""/g, uniqueStr);
const split = fileContents.split(/"([^"]*)"/g);
const memes = [];

for (const str of split) {
	if (str === '') continue;
	const finale = str.replace(new RegExp(uniqueStr, 'g'), '"').replace(/\r?\n$/g, '');
	if (finale.length === 0) continue;
	
	memes.push(finale);
}

module.exports = {
	name: 'mfortune',
	alias: ['memefortune', 'copypasta'],
	
	help_args: '',
	desc: 'Posts a random quote from http://www.twitchquotes.com/',
	
	func: function(args, cmd, msg) {
		return Array.Random(memes);
	}
};
