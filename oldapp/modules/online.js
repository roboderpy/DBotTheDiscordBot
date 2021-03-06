

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

hook.Add('SQLInitialize', 'uptime-bot', function() {
	Postgres.query('SELECT * FROM uptime_bot', function(err, data) {
		if (!data || !data[0]) {
			Postgres.query('INSERT INTO uptime_bot VALUES (' + CurTime() + ', 0)');
		}
	});
});

let usersCache = [];

setInterval(function() {
	if (!DBot.IsOnline())
		return;
	
	let finalQuery = '';
	
	for (let user of usersCache) {
		try {
			let status = user.presence.status;
			let ostatus = user.lastStatus;
			
			if (status !== ostatus) {
				finalQuery += 'UPDATE users SET "STATUS" = \'' + status + '\' WHERE "ID" = ' + DBot.GetUserID(user) + ';';
				user.lastStatus = status;
			}
		} catch(err) {
			// console.error(err);
		}
	}
	
	finalQuery += 'SELECT users_heartbeat();';
	Postgres.query(finalQuery);
}, 5000);

hook.Add('UserInitialized', 'LastSeen', function(user) {
	usersCache.push(user);
	
	if (!DBot.IsReady())
		return;
	
	Postgres.query('INSERT INTO uptime ("ID") VALUES (' + user.uid + ') ON CONFLICT ("ID") DO NOTHING', function(err, data) {
		if (err) console.error('Failed to create uptime entry: ' + err);
	});
	
	Postgres.query('UPDATE users SET "STATUS" = \'' + user.presence.status + '\' WHERE "ID" = ' + user.uid, function(err, data) {
		if (err) console.error('Failed to update users entry: ' + err);
	});
});

hook.Add('UpdateLoadingLevel', 'LastSeen', function(callFunc) {
	callFunc(true, 'statuses update', 'uptimes update');
});

hook.Add('UsersInitialized', 'LastSeen', function() {
	let users = DBot.GetUsers();
	
	let updateStr;
	let statusStr;
	
	for (let user of users) {
		if (!updateStr)
			updateStr = '(' + (user.uid || sql.User(user)) + ')';
		else
			updateStr += ',(' + (user.uid || sql.User(user)) + ')';
		
		try {
			user.lastStatus = user.presence.status;
			
			if (!statusStr)
				statusStr = '(' + (user.uid || sql.User(user)) + ',' + Postgres.escape(user.lastStatus) + '::discord_user_status)';
			else
				statusStr += ',(' + (user.uid || sql.User(user)) + ',' + Postgres.escape(user.lastStatus) + '::discord_user_status)';
		} catch(err) {
			
		}
	}
	
	if (updateStr)
		Postgres.query('INSERT INTO uptime ("ID") VALUES ' + updateStr + ' ON CONFLICT ("ID") DO NOTHING', function() {DBot.updateLoadingLevel(false, 'uptimes update');});
	else
		DBot.updateLoadingLevel(false, 'uptimes update');
	
	if (statusStr)
		Postgres.query('UPDATE users SET "STATUS" = "m"."STATUS" FROM (VALUES ' + statusStr + ') AS "m"("ID", "STATUS") WHERE users."ID" = "m"."ID"', function() {DBot.updateLoadingLevel(false, 'statuses update');});
	else
		DBot.updateLoadingLevel(false, 'statuses update');
});

setInterval(function() {
	if (DBot.IsOnline())
		Postgres.query('UPDATE uptime_bot SET "AMOUNT" = "AMOUNT" + 1');
}, 1000);

