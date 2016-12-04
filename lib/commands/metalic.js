
const child_process = require('child_process');
const spawn = child_process.spawn;
const URL = require('url');
const fs = require('fs');

Util.mkdir(DBot.WebRoot + '/im_composite');

var allowed = [
	'jpeg',
	'jpg',
	'png',
	'tif',
	'bmp',
];

module.exports = {
	name: 'metalic',
	alias: ['bmetalic'],
	
	help_args: '<url>',
	desc: 'Blends an image with metal texture\nUses `bumpmap` filter',
	allowUserArgument: true,
	
	func: function(args, cmd, msg) {
		var url = args[0];
		
		if (typeof(url) == 'object') {
			url = url.avatarURL;
			
			if (!url) {
				return 'Specified user have no avatar? ;w;';
			}
		}
		
		if (!url) {
			url = DBot.LastURLImageInChannel(msg.channel);
			
			if (!url) {
				return 'Invalid url maybe? ;w;' + Util.HighlightHelp(['metalic'], 2, args);
			}
		}
		
		var sha = DBot.HashString(url);
		var uObj = URL.parse(url);
		var path = uObj.pathname;
		var split = path.split('.');
		var ext = split[split.length - 1].toLowerCase();
		
		if (!DBot.HaveValue(allowed, ext))
			return 'Invalid url maybe? ;w;' + Util.HighlightHelp(['metalic'], 2, args);
		
		var fInput;
		
		var fpath = DBot.WebRoot + '/im_composite/' + sha + '.png';
		var fpathURL = DBot.URLRoot + '/im_composite/' + sha + '.png';
		
		var ContinueFunc = function() {
			fs.stat(fpath, function(err, stat) {
				if (stat) {
					msg.reply(fpathURL);
				} else {
					var magik = spawn('composite', ['(', '(', fInput, '-resize', '667x667>', ')', '-resize', '667x667<', ')', './resource/files/metal.png', '-compose', 'bumpmap', '-gravity', 'center', fpath]);
					
					Util.Redirect(magik);
					
					magik.on('close', function(code) {
						if (code == 0) {
							msg.reply(fpathURL);
						} else {
							msg.reply('Uh oh! You are trying to break me ;n; Why? ;n;');
						}
					});
				}
			});
		}
		
		DBot.LoadImageURL(url, function(newPath) {
			fInput = newPath;
			ContinueFunc();
		}, function(result) {
			msg.reply('Failed to download image. `HTTP Status Code: ' + (result.code || 'socket hangs up or connection timeout') + '`');
		});
	}
}

DBot.RegisterCommand({
	name: 'cmetalic',
	
	help_args: '<url>',
	desc: 'Blends an image with metal texture\nUses `color-burn` filter',
	allowUserArgument: true,
	
	func: function(args, cmd, msg) {
		var url = args[0];
		
		if (typeof(url) == 'object') {
			url = url.avatarURL;
			
			if (!url) {
				return 'Specified user have no avatar? ;w;';
			}
		}
		
		if (!url) {
			url = DBot.LastURLImageInChannel(msg.channel);
			
			if (!url) {
				return 'Invalid url maybe? ;w;' + Util.HighlightHelp(['metalic'], 2, args);
			}
		}
		
		var sha = DBot.HashString(url);
		var uObj = URL.parse(url);
		var path = uObj.pathname;
		var split = path.split('.');
		var ext = split[split.length - 1].toLowerCase();
		
		if (!DBot.HaveValue(allowed, ext))
			return 'Invalid url maybe? ;w;' + Util.HighlightHelp(['metalic'], 2, args);
		
		var fInput;
		
		var fpath = DBot.WebRoot + '/im_composite/' + sha + '_c.png';
		var fpathURL = DBot.URLRoot + '/im_composite/' + sha + '_c.png';
		
		var ContinueFunc = function() {
			fs.stat(fpath, function(err, stat) {
				if (stat) {
					msg.reply(fpathURL);
				} else {
					var magik = spawn('composite', ['(', '(', fInput, '-resize', '667x667>', ')', '-resize', '667x667<', ')', './resource/files/metal.png', '-compose', 'color-burn', '-gravity', 'center', fpath]);
					
					Util.Redirect(magik);
					
					magik.on('close', function(code) {
						if (code == 0) {
							msg.reply(fpathURL);
						} else {
							msg.reply('Uh oh! You are trying to break me ;n; Why? ;n;');
						}
					});
				}
			});
		}
		
		DBot.LoadImageURL(url, function(newPath) {
			fInput = newPath;
			ContinueFunc();
		}, function(result) {
			msg.reply('Failed to download image. `HTTP Status Code: ' + (result.code || 'socket hangs up or connection timeout') + '`');
		});
	}
});