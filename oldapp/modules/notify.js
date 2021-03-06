

// 
// Copyright (C) 2016-2017 DBot. All other content, that was used, but not created in this project, is licensed under their own licenses, and belong to their authors.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//      http://www.apache.org/licenses/LICENSE-2.0
//  
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// 

'use strict';

const myGlobals = require('../globals.js');
const hook = myGlobals.hook;
const DBot = myGlobals.DBot;
const sql = myGlobals.sql;
const IMagick = myGlobals.IMagick;
const Util = myGlobals.Util;
const cvars = myGlobals.cvars;
const Postgres = myGlobals.Postgres;

cvars.ServerVar('notifications', '0', [FCVAR_BOOLONLY], 'Notifications main power switch');

cvars.ServerVar('notify_jl', 'false', [FCVAR_BOOLONLY], 'Enable join/leave notifications');
cvars.ServerVar('notify_join', 'Hello, %user%! Welcome to %server%! You are %num%rd member to join.', [], 'Join message. Use %username% for printing only user\'s name, not @mention him.');
cvars.ServerVar('notify_join_e', 'true', [FCVAR_BOOLONLY], 'Enable join');
cvars.ServerVar('notify_left', '%user% left us alone ;n;', [], 'Leave message');
cvars.ServerVar('notify_left_e', 'true', [FCVAR_BOOLONLY], 'Enable leave');

hook.Add('SoftbanJoinPass', 'Notifications', function(user, server, member) {
	if (member.user.bot)
		return;
	
	if (!DBot.ServerIsInitialized(server))
		return;
	
	if (!cvars.Server(server).getVar('notifications').getBool()) return;
	if (!cvars.Server(server).getVar('notify_jl').getBool()) return;
	if (!cvars.Server(server).getVar('notify_join_e').getBool()) return;
	
	let channel = DBot.GetNotificationChannel(server);
	
	if (!channel)
		return;
	
	let format = cvars.Server(server).getVar('notify_join').getString()
		.replace('%user%', '<@' + user.id + '>')
		.replace('%username%', user.username)
		.replace('%num%', server.members.array().length)
		.replace('%server%', '**' + server.name + '**');
	
	channel.sendMessage(format);
});

hook.Add('HumanLeftServer', 'Notifications', function(user, server, member) {
	if (!DBot.ServerIsInitialized(server))
		return;
	
	if (!cvars.Server(server).getVar('notifications').getBool()) return;
	if (!cvars.Server(server).getVar('notify_jl').getBool()) return;
	if (!cvars.Server(server).getVar('notify_left_e').getBool()) return;
	
	let channel = DBot.GetNotificationChannel(server);
	
	if (!channel)
		return;
	
	if (member.kickedBySoftban)
		return;
	
	let format = cvars.Server(server).getVar('notify_left').getString()
		.replace('%user%', '<@' + user.id + '>')
		.replace('%username%', user.username)
		.replace('%server%', '**' + server.name + '**');
	
	channel.sendMessage(format);
});
