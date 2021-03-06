
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

import {CommandBase, CommandExecutionInstance, ImageCommandBase} from '../CommandBase'
import {CommandHolder} from '../CommandHolder'
import Discord = require('discord.js')
import cowsay = require('cowsay')

class Cowsay extends CommandBase {
	askFile: string
	args = '<string>'

	constructor(cowname: string) {
		super(cowname + 'say', cowname)
		this.help = cowname + 'say the word'
		this.askFile = cowname

		if (cowname == 'cow') {
			this.askFile = 'default'
		}
	}

	executed(instance: CommandExecutionInstance) {
		const result = <string> cowsay.say({
			text: instance.raw.replace(/```/gi, '``\`'),
			f: this.askFile
		})

		return '```\n' + result + '\n```'
	}
}

class ICowsay extends ImageCommandBase {
	askFile: string
	args = '<string>'

	constructor(cowname: string) {
		super('i' + cowname + 'say', 'i' + cowname)
		this.help = cowname + 'say the word'
		this.askFile = cowname

		if (cowname == 'cow') {
			this.askFile = 'default'
		}
	}

	executed(instance: CommandExecutionInstance) {
		if (!instance.hasPermissionBoth('ATTACH_FILES')) {
			instance.reply('Can not attach files!')
			return
		}

		const result = <string> cowsay.say({
			text: instance.raw.replace(/```/gi, '``\\`'),
			f: this.askFile
		})

		this.convert(instance, '-font', 'PT-Mono', '-pointsize', '64', '-background', 'transparent', '-fill', 'Grey', '-gravity', 'NorthWest',
		'label:' + this.escapeLiterals(result), 'png:-')
		.then((buff) => {
			instance.send('', new Discord.Attachment(buff, 'cowsay.png'))
		})
	}
}

const cows = [
	'cow',
	'tux',
	'sheep',
	'www',
	'dragon',
	'vader',
];

const RegisterCowsay = function(holder: CommandHolder) {
	for (const cow of cows) {
		holder.registerCommand(new Cowsay(cow))
		holder.registerCommand(new ICowsay(cow))
	}
}

export {RegisterCowsay}
