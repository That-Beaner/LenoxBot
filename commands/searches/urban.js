const Discord = require('discord.js');
const snekfetch = require('snekfetch');
exports.run = async(client, msg, args) => {
    const content = args.slice().join(" ");
    await snekfetch.get(`http://api.urbandictionary.com/v0/define?term=${content}`)
    .then(r => {
        let def = r.body.list[0];
        const embed = new Discord.RichEmbed()
            .setTitle("📚 Urban Dictionary")
            .setThumbnail("https://everythingfat.files.wordpress.com/2013/01/ud-logo.jpg")
            .setColor('#ABCDEF')
            .setDescription(`**Definition for ${def.word}**\n` + (def.definition.length > 1500 ? def.definition.substring(0, 1500) + "..." : def.definition))
            .addField("📃 Example", def.example.length > 1020 ? def.example.substring(0, 1020) + "..." : def.example, false)
            .addField("👍 Thumbs up", def.thumbs_up, true)
            .addField("👎 Thumbs down", def.thumbs_down, true);
            
        msg.channel.send({ embed });
    })
    .catch(err => {
        msg.channel.send("Could not find anything to your query!").then(m => m.delete(10000));
    });
};

exports.conf = {
	enabled: true,
	guildOnly: false,
    aliases: [],
    userpermissions: []
};
exports.help = {
	name: 'urban',
	description: 'Urban dictionary',
    usage: 'urban {query}',
    example: ['urban Discord'],
	category: 'searches',
    botpermissions: ['SEND_MESSAGES']
};