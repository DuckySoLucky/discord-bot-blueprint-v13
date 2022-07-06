const config = require("../../config.json");
const hypixel = require('../handlers/Hypixel')
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Client, GuildMember, Interaction } = require('discord.js');
const fs = require("fs");
const axios = require('axios');
process.on('uncaughtException', function (err) {console.log(err.stack);});

// Ye I'm hard coding it because I'm lazy af
const immune = [
    "82cfa18b83e34f8085c1a0e8fe3c28a3", // Pablo
    "3dca5274c8b4482b8d2e00a07b59dbe3", // Potato
    "2700c8b565c74d8e9be5eb7a6ae19295", // Dark
    "af7a55015b034990b2f30e7ab44295de", // Calculus
    "275bdb780e3b4b9e883445536c8251ce"  // Wrist Spasm Bot
];

const permissionEmbed = new MessageEmbed()
    .setColor('#ff0000')
    .setAuthor({ name: 'An Error has occured!'})
    .setDescription(`You do not have permission to use this command!`)
    .setFooter({ text: '© Wrist Spasm 2022', iconURL: 'https://cdn.discordapp.com/avatars/737095235242295337/0f2231e412654906a658fa4873bd7933.png?size=4096' });


module.exports = {
	data: new SlashCommandBuilder()
        .setName("gexpcheck")
        .setDescription("(Admin Command) Shows everyone that got less than 50k GEXP in the last 7 days"),

        /**
         * 
         * @param {Interaction} interaction 
         * @param {Client} client 
         * @param {GuildMember} member 
         * @returns 
         */
        async execute(interaction, client, member) {
            if (!(await member).roles.cache.has(config.roles.admin_role_id) && !(await member).permissions.has("ADMINISTRATOR")) {
                interaction.reply({ embeds: [permissionEmbed] });
                return;
            }
    
            hypixel.getGuild("id", config.minecraft.guild_id).then(guild => {
                    let expStr = "";
                    for (const member of guild.members) {
                        if (member.weeklyExperience < 50000 && member.joinedAtTimestamp < Date.now() - 604800000 && !immune.includes(member.uuid.toLowerCase())) {
                            axios({
                                method: 'get',
                                url: `https://api.hypixel.net/player?key=${config.minecraft.apiKey}&uuid=${member.uuid}`
                            }).then(function (response) {
                                expStr += `${response.data.player.displayname} » ${member.weeklyExperience}\n`;
                                fs.writeFileSync("data/exp.txt", `${expStr}`);
                            }).catch((error)=>{console.log(error)});
                        }                  
                    }
                    interaction.reply({ files: [ "data/exp.txt" ], content: "**Weekly Guild Experience**" });
    
            }).catch(err => {
                const errorEmbed = new MessageEmbed()
                    .setColor('#ff0000')
                    .setAuthor({ name: 'An Error has occured!'})
                    .setDescription(`${err}`)
                    .setFooter({ text: '© Wrist Spasm 2022', iconURL: 'https://cdn.discordapp.com/avatars/737095235242295337/0f2231e412654906a658fa4873bd7933.png?size=4096' });
                interaction.reply({ embeds: [errorEmbed] });
            });
        }
    }
    