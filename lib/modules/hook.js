
hook = {};
hook.Table = {};

hook.Add = function(event, id, func) {
	if (!event)
		return;
	
	if (!id)
		return;
	
	if (!func)
		return;
	
	if (!hook.Table[event])
		hook.Table[event] = {};
	
	hook.Table[event][id] = func;
}

hook.Remove = function(event, id) {
	if (!hook.Table[event])
		return;
	
	hook.Table[event][id] = undefined;
}

hook.Call = function(event, A, B, C, D, E, F, G) {
	if (!hook.Table[event])
		return;
	
	for (var k in hook.Table[event]) {
		var func = hook.Table[event][k];
		var reply = func(A, B, C, D, E, F, G);
		
		if (reply != undefined)
			return reply;
	}
}

hook.Run = hook.Call

hook.GetTable = function() {
	return hook.Table;
}

var botHooks = [
	['guildCreate', 'OnJoinedServer'],
	['guildDelete', 'OnLeftServer'],
	['guildEmojiCreate', 'EmojiCreated'],
	['guildEmojiDelete', 'EmojiDeleted'],
	['guildEmojiUpdate', 'EmojiUpdated'],
	['guildMemberAdd', 'ClientJoinsServer'],
	['guildMemberAvailable', 'ClientJoinedServer'],
	['guildMemberRemove', 'ClientLeftServer'],
	['guildUnavailable', 'ServerWentsDown'],
	['disconnect', 'OnDisconnect'],
	['guildUpdate', 'ServerChanges'],
	['messageDelete', 'OnMessageDeleted'],
	['messageUpdate', 'OnMessageEdit'],
	['reconnecting', 'OnReconnect'],
	['channelCreate', 'ChannelCreated'],
	['channelDelete', 'ChannelDeleted'],
	['channelUpdate', 'ChannelUpdates'],
];

hook.RegisterEvents = function() {
	botHooks.forEach(function(item) {
		DBot.bot.on(item[0], function(a, b, c, d, e) {
			hook.Run(item[1], a, b, c, d, e);
		});
	});

	console.log('Hooks Registered!');
};

hook.Add('ClientJoinsServer', 'Default', function(client) {
	if (client.user.id == DBot.client.id)
		return;
	
	hook.Run('ValidClientJoinsServer', client.user, client.guild);
	
	if (client.user.bot) {
		hook.Run('BotJoinsServer', client.user, client.guild);
	} else {
		hook.Run('HumanJoinsServer', client.user, client.guild);
	}
});

hook.Add('ClientJoinedServer', 'Default', function(client) {
	if (client.user.id == DBot.client.id)
		return;
	
	hook.Run('ValidClientJoinedServer', client.user, client.guild);
	
	if (client.user.bot) {
		hook.Run('BotJoinedServer', client.user, client.guild);
	} else {
		hook.Run('HumanJoinedServer', client.user, client.guild);
	}
});

hook.Add('ClientLeftServer', 'Default', function(client) {
	if (client.user.id == DBot.client.id)
		return;
	
	hook.Run('ValidClientLeftServer', client.user, client.guild);
	
	if (client.user.bot) {
		hook.Run('BotLeftServer', client.user, client.guild);
	} else {
		hook.Run('HumanLeftServer', client.user, client.guild);
	}
});

var URLMessages = {};

DBot.LastURLInChannel = function(channel) {
	var cid = channel.id;
	return URLMessages[cid];
}

hook.Add('OnMessage', 'LastURLInChannel', function(msg) {
	var cid = msg.channel.id;
	var get = msg.content.match(new RegExp('https?://([^ `\n]*)', 'g'));
	
	if (!get)
		return;
	
	var last = get[get.length - 1];
	URLMessages[cid] = last;
});

hook.Add('ChannelDeleted', 'LastURLInChannel', function(channel) {
	var cid = channel.id;
	URLMessages[cid] = undefined;
});
