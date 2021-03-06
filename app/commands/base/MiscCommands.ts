
//
// Copyright (C) 2017-2018 DBot.
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

import {CommandBase, CommandExecutionInstance} from '../CommandBase'
import {CommandHolder} from '../CommandHolder'
import Discord = require('discord.js')
import { BotInstance } from '../../BotInstance';

class Invite extends CommandBase {
	help = 'Invite link'
	canBeBanned = false

	constructor() {
		super('invite')
	}

	executed(instance: CommandExecutionInstance) {
		return 'Link https://discordapp.com/api/oauth2/authorize?client_id=' + (<BotInstance> this.bot).id + '&scope=bot&permissions=0\nJoin https://discord.gg/HG9eS79';
	}
}

class SetAvatar extends CommandBase {
	help = 'Set bot avatar'
	displayHelp = false
	allowUsers = true
	canBeBanned = false

	constructor() {
		super('setavatar')
	}

	executed(instance: CommandExecutionInstance) {
		const img = instance.findImage(instance.next())

		if (!img) {
			instance.error('Nu image? ;n;', 1)
			return
		}

		instance.loadImage(img).then((path: string) => {
			(<BotInstance> this.bot).client.user.setAvatar(path)
			.catch((err) => {
				instance.send(err)
			}).then(() => {
				instance.reply('Avatar updated successfully')
			})
		})
	}
}

class GetAvatar extends CommandBase {
	help = 'Get user(s) avatar(s)'
	allowUsers = true

	constructor() {
		super('avatar')
	}

	executed(instance: CommandExecutionInstance) {
		let reply = 'Avatars: '

		for (const [i,  user] of instance) {
			if (typeof user != 'object') {
				instance.error('Not a user!', i)
				return
			}

			reply += '\n' + (<Discord.User> user).avatarURL + ' '
		}

		return reply
	}
}

class About extends CommandBase {
	help = 'About'
	canBeBanned = false

	constructor() {
		super('about')
	}

	executed(instance: CommandExecutionInstance) {
		return 'DeeeBootTheDeescordBot V2.0\nRewrite because this thing needs to work better.'
	}
}

class DateCommand extends CommandBase {
	help = 'Shows current date'
	canBeBanned = false

	constructor() {
		super('about')
	}

	executed(instance: CommandExecutionInstance) {
		return 'Today is: `' + (new Date()).toString() + '` for me.'
	}
}

import numeral = require('numeral')
import humanizeDuration = require('humanize-duration')

interface NodeRelease {
	name: string
	sourceUrl: string
	headersUrl: string
	libUrl: string
}

class BotInfoCommand extends CommandBase {
	help = 'Shows bot information'
	canBeBanned = false

	constructor() {
		super('botinfo')
	}

	executed(instance: CommandExecutionInstance) {
		const memory = process.memoryUsage()

		return `\`\`\`
Platform:           ${process.platform}
Release name:       ${(<NodeRelease> process.release).name}
Release URL:        ${(<NodeRelease> process.release).sourceUrl}
Release Headers:    ${(<NodeRelease> process.release).headersUrl}
Version:            ${process.version}
Uptime:             ${humanizeDuration(process.uptime() * 1000)}
Mem Allocated:      ${numeral(memory.rss).format('0b')}
Heap:               ${numeral(memory.heapTotal).format('0b')}
Heap used:          ${numeral(memory.heapUsed).format('0b')}
\`\`\``
	}
}

const initMessage = [
	'Bleh', 'Pne?', 'Ponies are coming for you', 'Ponis everiwhere!', 'gnignip', 'k', 'Am I a bot?',
	'It is so fun!', 'Lookin\' for something interesting', '*jumps*', 'pew pew', 'vroom'
];

const finishMessage = [
	'this server', 'equestrian bunkers', 'dimension portal controller', 'factories', 'russian botnet',
	'pony PC botnet', 'your PC', 'your Router', 'NSA', 'Mars', 'laboratories', 'bad humans jail',
	'the Machine', 'skynet prototype', 'Russia', 'USA nuclear bombs timer', 'Discord status server',
	'burning fire', 'Google DNS', 'leafletjs.com maps', 'GitLab', 'not working GitHub', 'NotSoSuper',
	'DBot', 'a cat', 'Java application', 'british secret bases', 'China supercomputers', '\\n',
	'your code', 'cake', 'NotSoBot', 'command', 'trap music DJ', 'localhost', '127.0.0.1', '127.199.199.1',
	'meow', 'hacked Miecraft server', 'GMod updates', 'isitdownrightnow.com', 'Google AI', 'Samsung smartphone',
	'memeland', 'block cutting machine', 'HAYO PRODUCTIONS!', 'SCP-173'
];

class Ping extends CommandBase {
	help = 'Time to reply'
	canBeBanned = false

	constructor() {
		super('ping')
	}

	executed(instance: CommandExecutionInstance) {
		const now = Date.now()
		const promise = instance.send(initMessage[Math.floor(Math.random() * (initMessage.length - 1))])

		if (promise) {
			promise.then((msg) => {
				(<Discord.Message> msg).edit(`It takes **${(Date.now() - now)}** ms to ping **${instance.next() || finishMessage[Math.floor(Math.random() * (finishMessage.length - 1))]}**`)
			})
		}
	}
}

export {Invite, SetAvatar, GetAvatar, About, Ping, DateCommand, BotInfoCommand}
