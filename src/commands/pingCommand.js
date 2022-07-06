const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
process.on('uncaughtException', function (err) {console.log(err.stack);});

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Simple Ping Command"),

    async execute(interaction, client, member) {
      const uptimeEmbed = new MessageEmbed()
        .setColor('#00FF00')
        .setAuthor({ name: 'Bot Latency'})
        .setDescription(`API Latency: **${client.ws.ping} ms**`)
        .setFooter({ text: '© Made by DuckySoLucky', iconURL: 'https://cdn.discordapp.com/avatars/486155512568741900/31cabcf3c42823f8d8266fd22babb862.png?size=4096' });

      await interaction.reply({embeds: [ uptimeEmbed ] });
    }
}