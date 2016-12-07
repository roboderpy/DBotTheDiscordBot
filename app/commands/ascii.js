
const child_process = require('child_process');
const spawn = child_process.spawn;
const fs = require('fs');

const font = 'Hack-Regular';
const size = 48;

Util.mkdir(DBot.WebRoot + '/text', function() {
	Util.mkdir(DBot.WebRoot + '/text/temp')
});

const figlet = require('figlet');

module.exports = {
	name: 'ascii',
	alias: ['figlet'],
	
	argNeeded: true,
	failMessage: 'Missing phrase',
	
	help_args: '<phrase> ...',
	desc: 'Turn chars into ASCII art\nUses figlet library',
	
	func: function(args, cmd, msg) {
		if (cmd.length > 30)
			return 'Too big!';
		
		figlet.text(cmd, {
			kerning: 'full',
		}, function(err, data) {
			if (err) {
				msg.reply('<internal pony error>')
				return;
			}
			
			msg.reply('```' + data + '```');
		});
	},
}

DBot.RegisterCommandPipe({
	name: 'iascii',
	alias: ['ifiglet'],
	
	argNeeded: true,
	failMessage: 'Missing phrase',
	
	help_args: '<phrase> ...',
	desc: 'Turn chars into ASCII art as image\nUses figlet library',
	
	func: function(args, cmd, msg) {
		if (cmd.length > 400)
			return 'You wot';
		
		var sha = DBot.HashString(cmd);
		var fpath = DBot.WebRoot + '/text/' + sha + '_figlet.png';
		var fpathU = DBot.URLRoot + '/text/' + sha + '_figlet.png';
		
		fs.stat(fpath, function(err, stat) {
			if (stat) {
				msg.reply(fpathU);
			} else {
				figlet.text(cmd, {
					kerning: 'full',
				}, function(err, data) {
					if (err) {
						msg.reply('<internal pony error>')
						return;
					}
					
					var splitLines = data.split('\n');
					
					var max = 0;
					
					for (var i in splitLines) {
						if (splitLines[i].length > max)
							max = splitLines[i].length;
					}
					
					var calcHeight = splitLines.length * size * 1.1;
					var calcWidth = max * size * .6 + 40;
					
					var magikArgs = [
						'-size', calcWidth + 'x' + calcHeight,
						'canvas:none',
						'-pointsize', size,
						'-font', font,
						'-gravity', 'NorthWest',
						'-fill', 'black',
					];
					
					let buildDraw = '';
					
					magikArgs.push('-draw');
					
					for (var i in splitLines) {
						var line = splitLines[i];
						
						buildDraw += ' text 0,' + (i * size * 1.1) + ' "' + line.replace(/"/g, "'").replace(/\\/g, "\\\\") + '"';
					}
					
					magikArgs.push(buildDraw);
					
					magikArgs.push(fpath);
					
					var magik = spawn('convert', magikArgs);
					
					Util.Redirect(magik);
					
					magik.on('close', function(code) {
						if (code == 0) {
							msg.reply(fpathU);
						} else {
							msg.reply('<internal pony error>');
						}
					});
				});
			}
		});
		
		return true;
	}
});

DBot.RegisterCommandPipe({
	name: 'lascii',
	alias: ['lolascii', 'lolcatascii', 'lfiglet', 'lolfiglet', 'lifiglet'],
	
	argNeeded: true,
	failMessage: 'Missing phrase',
	
	help_args: '<phrase> ...',
	desc: 'Turn chars into ASCII art as image\nUses figlet library\nAlso applies lolcat',
	
	func: function(args, cmd, msg) {
		if (cmd.length > 400)
			return 'You wot';
		
		var sha = DBot.HashString(cmd);
		var fpath = DBot.WebRoot + '/text/' + sha + '_figlet_lolcat.png';
		var fpathU = DBot.URLRoot + '/text/' + sha + '_figlet_lolcat.png';
		
		fs.stat(fpath, function(err, stat) {
			if (stat) {
				msg.reply(fpathU);
			} else {
				figlet.text(cmd, {
					kerning: 'full',
				}, function(err, data) {
					if (err) {
						msg.reply('<internal pony error>')
						return;
					}
					
					var splitLines = data.split('\n');
					
					var max = 0;
					
					for (var i in splitLines) {
						if (splitLines[i].length > max)
							max = splitLines[i].length;
					}
					
					var charWidth = max;
					var charHeight = splitLines.length;
					var calcWidth = max * size * .6 + 20;
					
					var magikArgs = [
						'-size', calcWidth + 'x' + (size * 1.1),
						'canvas:none',
						'-pointsize', size,
						'-font', font,
						'-gravity', 'NorthWest',
					];
					
					let magikLines = [];
					
					for (let lineNum in splitLines) {
						let lineArg = [];
						magikLines.push(lineArg);
						let line = splitLines[lineNum];
						
						for (let charNum in line) {
							let red = Math.cos(lineNum / charHeight * 3 - charNum / line.length * 2) * 127 + 128;
							let green = Math.sin(charNum / line.length - lineNum / charHeight * 5) * 127 + 128;
							let blue = Math.sin(lineNum / charHeight * 2 - charNum / line.length * 3) * 127 + 128;
							
							lineArg.push('-fill', 'rgb(' + Math.floor(red) + ',' + Math.floor(green) + ',' + Math.floor(blue) + ')', '-draw', 'text ' + Math.floor(charNum * size * .6) + ',0 ' + '"' + line[charNum].replace('\\', '\\\\') + '"');
						}
					}
					
					let linesLeft = magikLines.length;
					let BREAK = false;
					
					var continueFunc = function() {
						let outputArgs = [];
						
						for (let line in magikLines) {
							outputArgs.push(DBot.WebRoot + '/text/temp/' + sha  + '_ascii_' + line + '.png');
						}
						
						outputArgs.push('-append', fpath);
						
						let magik = spawn('convert', outputArgs);
						
						Util.Redirect(magik);
						
						magik.on('close', function(code) {
							if (code == 0) {
								msg.reply(fpathU);
							} else {
								msg.reply('<internal pony error>');
							}
						});
					}
					
					for (let line in magikLines) {
						let newArgs = Util.AppendArrays(Util.CopyArray(magikArgs), magikLines[line]);
						
						newArgs.push(DBot.WebRoot + '/text/temp/' + sha + '_ascii_' + line + '.png');
						let magik = spawn('convert', newArgs);
						
						Util.Redirect(magik);
						
						magik.on('close', function(code) {
							if (BREAK) {
								return;
							}
							
							if (code == 0) {
								linesLeft--;
								
								if (linesLeft == 0) {
									continueFunc();
								}
							} else {
								msg.reply('<internal pony error>');
								BREAK = true;
							}
						});
					}
				});
			}
		});
		
		return true;
	}
});
