
const child_process = DBot.js.child_process;
const spawn = child_process.spawn;
const URL = DBot.js.url;
const unirest = DBot.js.unirest;
const fs = DBot.js.filesystem;

fs.stat(DBot.WebRoot + '/invaded', function(err, stat) {
	if (!stat)
		fs.mkdir(DBot.WebRoot + '/invaded');
});

module.exports = {
	name: 'invaded',
	alias: ['invade'],
	
	help_args: '<user>',
	desc: 'INVASION',
	allowUserArgument: true,
	
	func: function(args, cmd, msg) {
		if (typeof(args[0]) != 'object')
			return 'Must be an user ;n;';
		
		let url = args[0].avatarURL;
		
		if (!url)
			return 'User have no avatar? ;w;';
		
		let hash = String.hash(url);
		
		let fPath;
		
		let fPathProcessed = DBot.WebRoot + '/invaded/' + hash + '.png';
		let fPathProcessedURL = DBot.URLRoot + '/invaded/' + hash + '.png';
		
		msg.channel.startTyping();

		let ContinueFunc = function() {
			fs.stat(fPathProcessed, function(err, stat) {
				if (stat && stat.isFile()) {
					msg.reply(fPathProcessedURL);
					msg.channel.stopTyping();
				} else {
					let magik = spawn('convert', [
						fPath,
						'-resize', '512x512',
						'-color-matrix', '.3 .1 .3 .3 .1 .3 .3 .1 .3',
						'-draw', 'rectangle 0, 400, 512, 480',
						'-fill', 'black',
						'-gravity', 'South',
						'-fill', 'white',
						'-weight', 'Bold',
						'-pointsize', '24',
						'-draw', 'text 0,60 "' + args[0].username + ' has invaded!"',
						fPathProcessed
					]);
					
					Util.Redirect(magik);
					
					magik.on('close', function(code) {
						msg.channel.stopTyping();
						
						if (code == 0) {
							msg.reply(fPathProcessedURL);
						} else {
							msg.reply('<internal pony error>');
						}
					});
				}
			});
		}
		
		DBot.LoadImageURL(url, function(newPath) {
			fPath = newPath;
			ContinueFunc();
		}, function(result) {
			msg.channel.stopTyping();
			msg.reply('Failed to download image. "HTTP Status Code: ' + (result.code || 'socket hangs up or connection timeout') + '"');
		});
	}
}
