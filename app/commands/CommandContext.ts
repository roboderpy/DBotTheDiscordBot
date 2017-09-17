
//
// Copyright (C) 2017 DBot.
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

import Discord = require('discord.js')
import {ParseString} from '../../lib/StringUtil'
import {BotInstance} from '../BotInstance'
import {GEventEmitter} from '../../lib/glib/GEventEmitter'

class CommandContext extends GEventEmitter {
	msg: Discord.Message | null = null
	author: Discord.User | null = null
	channel: Discord.TextChannel | Discord.DMChannel | Discord.GroupDMChannel | null = null
	member: Discord.GuildMember | null = null
	self: Discord.GuildMember | null = null
	server: Discord.Guild | null = null
	userid: string | null = null
	serverid: string | null = null

	raw: string = ''
	args: string[] = []
	argsPipes: string[][] = []
	parsedArgs: any[] = []
	parsedPipes: any[][] = []
	parsed = false
	bot: BotInstance

	allowUsers: boolean = false
	allowPipes: boolean = true
	executed: boolean = false

	get sid() { return this.serverid }
	get uid() { return this.userid }
	get guild() { return this.server }
	get user() { return this.author }
	get sender() { return this.author }
	get inServer() { return this.server != null }
	get inDM() { return typeof this.channel == 'object' && this.channel instanceof Discord.DMChannel }

	constructor(bot: BotInstance, rawInput: string, msg?: Discord.Message) {
		super()
		this.raw = rawInput
		this.bot = bot

		if (msg) {
			this.msg = msg
			this.author = msg.author
			this.channel = msg.channel
			this.userid = msg.author.id
			this.userid = msg.author.id

			if (msg.guild) {
				this.server = msg.guild
				this.self = msg.guild.member(bot.id)
				this.member = msg.member
				this.serverid = msg.guild.id
			}
		}
	}

	send(content: string) {
		if (!this.channel) {
			return null
		}

		const status = this.emit('send', content)

		if (status != undefined) {
			if (typeof status == 'string') {
				return this.channel.send(status)
			}

			return status
		}

		return this.channel.send(content)
	}

	typing(status: boolean) {
		if (!this.msg) {
			return null
		}

		if (status) {
			this.msg.channel.startTyping()
		} else {
			this.msg.channel.stopTyping()
		}

		return this.msg
	}

	getCommand() {
		if (!this.parsed || !this.args[0]) {
			return null
		}

		return this.args[0].toLowerCase()
	}

	parseArgs(strIn: string) {
		this.parsed = true
		const parsedData = ParseString(this.raw)
		this.args = parsedData[0]
		parsedData.splice(0, 1)

		if (this.allowPipes) {
			this.argsPipes = parsedData
		} else {
			for (const obj of parsedData) {
				for (const obj2 of obj) {
					this.args.push(obj2)
				}
			}
		}

		this.parsedArgs = this.args

		return this
	}

	hasArguments() {
		return this.args.length > 1
	}

	*next() {
		for (const arg of this.args) {
			yield arg
		}
	}

	concatArgs(split = ' ') {
		if (!this.parsed) {
			return ''
		}

		return this.args.join(split)
	}

	parse() {
		return this.parseArgs(this.raw)
	}
}

export {CommandContext}
