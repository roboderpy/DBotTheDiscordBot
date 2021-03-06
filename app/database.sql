
--
-- Copyright (C) 2017 DBot.
--
-- Licensed under the Apache License, Version 2.0 (the "License");
-- you may not use this file except in compliance with the License.
-- You may obtain a copy of the License at
--
--      http://www.apache.org/licenses/LICENSE-2.0
--
-- Unless required by applicable law or agreed to in writing, software
-- distributed under the License is distributed on an "AS IS" BASIS,
-- WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
-- See the License for the specific language governing permissions and
-- limitations under the License.
--

CREATE TABLE IF NOT EXISTS "roleplay" (
	"actor" BIGINT NOT NULL,
	"target" BIGINT NOT NULL,
	"action" SMALLINT NOT NULL,
	"times" INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY ("actor", "target", "action")
);

CREATE TABLE IF NOT EXISTS "roleplay_generic" (
	"actor" BIGINT NOT NULL,
	"action" SMALLINT NOT NULL,
	"times" INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY ("actor", "action")
);

CREATE TABLE IF NOT EXISTS "server_colors" (
	"server" BIGINT NOT NULL,
	"colors" BIGINT[] NOT NULL,
	PRIMARY KEY ("server")
);

CREATE TABLE IF NOT EXISTS "shipping" (
	"first" BIGINT NOT NULL,
	"second" BIGINT NOT NULL,
	"times" INTEGER NOT NULL DEFAULT 1,
	PRIMARY KEY ("first", "second")
);

CREATE TABLE IF NOT EXISTS "command_ban_channel" (
	"server" BIGINT NOT NULL,
	"channel" BIGINT NOT NULL,
	"commands" VARCHAR(255)[] DEFAULT ARRAY[]::VARCHAR(255)[],
	PRIMARY KEY ("server", "channel")
);

CREATE TABLE IF NOT EXISTS "command_ban_server" (
	"server" BIGINT NOT NULL,
	"commands" VARCHAR(255)[] DEFAULT ARRAY[]::VARCHAR(255)[],
	PRIMARY KEY ("server")
);

CREATE TABLE IF NOT EXISTS "hangman_stats" (
	"user" BIGINT NOT NULL PRIMARY KEY,
	"games" INTEGER NOT NULL DEFAULT 0,
	"started" INTEGER NOT NULL DEFAULT 0,
	"stopped" INTEGER NOT NULL DEFAULT 0,
	"victories" INTEGER NOT NULL DEFAULT 0,
	"defeats" INTEGER NOT NULL DEFAULT 0,

	"guesses" INTEGER NOT NULL DEFAULT 0,
	"guesses_hits" INTEGER NOT NULL DEFAULT 0,
	"guesses_miss" INTEGER NOT NULL DEFAULT 0,

	"full_guesses" INTEGER NOT NULL DEFAULT 0,
	"full_guesses_hits" INTEGER NOT NULL DEFAULT 0,
	"full_guesses_miss" INTEGER NOT NULL DEFAULT 0,

	"length" INTEGER NOT NULL DEFAULT 0,
	"length_guess" INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "steamid_cache" (
	"steamid" BIGINT NOT NULL PRIMARY KEY,
	"communityvisibilitystate" INTEGER NOT NULL DEFAULT 0,
	"profilestate" INTEGER NOT NULL DEFAULT 0,
	"personaname" VARCHAR(255) NOT NULL DEFAULT '<missing>',
	"lastlogoff" INTEGER NOT NULL DEFAULT 0,
	"profileurl" VARCHAR(255) NOT NULL DEFAULT '<missing>',
	"avatar" VARCHAR(255) NOT NULL DEFAULT '<missing>',
	"avatarmedium" VARCHAR(255) NOT NULL DEFAULT '<missing>',
	"avatarfull" VARCHAR(255) NOT NULL DEFAULT '<missing>',
	"personastate" INTEGER NOT NULL DEFAULT 0,
	"realname" VARCHAR(255) NOT NULL DEFAULT '<missing>',
	"primaryclanid" VARCHAR(255) NOT NULL DEFAULT '<missing>',
	"timecreated" BIGINT NOT NULL DEFAULT 0,
	"personastateflags" INTEGER NOT NULL DEFAULT 0,
	"loccountrycode" VARCHAR(15) NOT NULL DEFAULT '',
	"locstatecode" VARCHAR(15) NOT NULL DEFAULT '',
	"loccityid" INTEGER NOT NULL DEFAULT 0,

	"expires" BIGINT NOT NULL DEFAULT 0
);
