const LenoxCommand = require('../LenoxCommand.js');
const settings = require('../../settings.json');
const keygenerator = require('../../utils/keygenerator.js');

module.exports = class createserverkeyCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'createserverkey',
			group: 'botowner',
			memberName: 'createserverkey',
			description: 'Creates a premium serverkey',
			format: 'createserverkey',
			aliases: [],
			examples: ['createserverkey'],
			clientPermissions: ['SEND_MESSAGES'],
			userPermissions: [],
			shortDescription: 'General',
			dashboardsettings: true
		});
	}

	async run(msg) {
		const langSet = msg.client.provider.getGuild(msg.message.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);

		const Discord = require('discord.js');
		if (!settings.owners.includes(msg.author.id)) return msg.channel.send(lang.botownercommands_error);

		let key = '';

		for (let i = 0; i < 1000; i++) {
			key = keygenerator.generateKey();

			if (!msg.client.provider.getBotsettings('botconfs', 'premium').guildkeys.includes(key)) {
				break;
			}

			if (i === 999) {
				key = undefined;
			}
		}

		if (key !== undefined) {
			const currentPremium = msg.client.provider.getBotsettings('botconfs', 'premium');
			currentPremium.guildkeys.push(key);
			await msg.client.provider.setBotsettings('botconfs', 'premium', currentPremium);
		}

		const embeddescription = lang.createserverkey_embeddescription.replace('%premiumcode', key);
		const embed = new Discord.RichEmbed()
			.setDescription(embeddescription)
			.setAuthor(msg.author.tag, msg.author.displayAvatarURL)
			.setTimestamp()
			.setColor('#cc99ff')
			.setTitle(lang.createserverkey_embedtitle);
		await msg.client.channels.get(settings.keychannel).send({ embed });

		return msg.reply(lang.createserverkey_message);
	}
};