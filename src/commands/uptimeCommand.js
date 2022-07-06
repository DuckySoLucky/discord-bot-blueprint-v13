const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
process.on('uncaughtException', function (err) {console.log(err.stack);});

module.exports = {
	data: new SlashCommandBuilder()
    .setName("uptime")
    .setDescription("Simple Uptime Command"),

    async execute(interaction, client, member) {
      const days = Math.floor(process.uptime() / 86400);
      const hours = Math.floor(process.uptime() / 3600) % 24;
      const minutes = Math.floor(process.uptime() / 60) % 60;
      const seconds = Math.floor(process.uptime() % 60);
      const uptimeEmbed = new MessageEmbed()
        .setColor('#00FF00')
        .setAuthor({ name: 'Bot Uptime'})
        .setDescription(`**${days}** day(s)\n**${hours}** hour(s)\n**${minutes}** minute(s)\n**${seconds}** second(s)`)
        .setFooter({ text: '© Made by DuckySoLucky', iconURL: 'https://cdn.discordapp.com/avatars/486155512568741900/31cabcf3c42823f8d8266fd22babb862.png?size=4096' });

      await interaction.reply({embeds: [ uptimeEmbed ] });
    }
}