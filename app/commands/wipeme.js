
module.exports = {
	name: 'wipeme',
	
	help_args: '',
	desc: 'Wipes messages written by you in current channel',
	
	func: function(args, cmd, msg) {
		if (DBot.IsPM(msg))
			return 'Must execute in server channel ;n;';
		
		var me = DBot.FindMeInChannel(msg.channel);
		
		if (!me)
			return '<internal pony error>';
		
		if (!me.hasPermission('MANAGE_MESSAGES'))
			return 'I must have MANAGE_MESSAGES permission ;n;';
		
		var filterID = msg.author.id;
		
		var conf = new DBot.Confirm(msg.author, msg.channel);
		
		conf.setTitle('Wipe of messages written by you');
		conf.setDesc('');
		
		conf.confirm(function() {
			conf.clearMessages();
			
			msg.channel.fetchMessages({limit: 100})
			.then(function() {
				var messages = msg.channel.messages;
				var arr = messages.array();
				if (!arr[0]) {
					msg.channel.sendMessage('No messages to remove? WTF');
					return;
				}
				
				var filtered = [];
				
				for (var i in arr) {
					if (arr[i].author.id != filterID)
						continue;
					
					if (!arr[i].deletable)
						continue;
					
					if (filtered.length > 100)
						break;
					
					filtered.push(arr[i]);
				}
				
				if (!filtered[0]) {
					msg.channel.sendMessage('No messages matched to be removed.');
					return;
				}
				
				var continueDelete = function() {
					for (var i in filtered) {
						if (i == 0)
							continue;
						
						filtered[i].delete(0);
					}
				}
				
				filtered[0].delete(0).then(continueDelete)
				.catch(function(mess) {
					if (mess.status == 404) {
						continueDelete();
						return;
					}
					
					msg.channel.sendMessage('Can\'t delete ;n;');
				});
			});
		});
		
		conf.decline(function() {
			msg.reply('Aborting');
		});
		
		conf.echo();
	},
}

DBot.RegisterCommand({
	name: 'wipebot',
	
	help_args: '',
	desc: 'Wipes messages written by me in current channel',
	
	func: function(args, cmd, msg) {
		if (DBot.IsPM(msg))
			return 'Must execute in server channel ;n;';
		
		if (!msg.member.hasPermission('MANAGE_MESSAGES') && msg.author.id != DBot.DBot)
			return 'You must have MANAGE_MESSAGES permission to command me that ;n;';
		
		var filterID = DBot.bot.user.id;
		
		var conf = new DBot.Confirm(msg.author, msg.channel);
		
		conf.setTitle('Wipe of messages written by me');
		conf.setDesc('');
		
		conf.confirm(function() {
			conf.clearMessages();
			
			msg.channel.fetchMessages({limit: 100})
			.then(function() {
				var messages = msg.channel.messages;
				var arr = messages.array();
				if (!arr[0]) {
					msg.channel.sendMessage('No messages to remove? WTF');
					return;
				}
				
				var filtered = [];
				
				for (var i in arr) {
					if (arr[i].author.id != filterID)
						continue;
					
					if (!arr[i].deletable)
						continue;
					
					if (filtered.length > 100)
						break;
					
					filtered.push(arr[i]);
				}
				
				if (!filtered[0]) {
					msg.channel.sendMessage('No messages matched to be removed.');
					return;
				}
				
				var continueDelete = function() {
					for (var i in filtered) {
						if (i == 0)
							continue;
						
						filtered[i].delete(0);
					}
				}
				
				filtered[0].delete(0).then(continueDelete)
				.catch(function(mess) {
					if (mess.status == 404) {
						continueDelete();
						return;
					}
					
					msg.channel.sendMessage('Can\'t delete ;n;');
				});
			});
		});
		
		conf.decline(function() {
			msg.reply('Aborting');
		});
		
		conf.echo();
	},
});