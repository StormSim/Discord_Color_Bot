import dotenv from 'dotenv';
dotenv.config();

import { Client, GatewayIntentBits, EmbedBuilder, Collection } from 'discord.js';
import fetch from 'node-fetch';
import cron from 'node-cron';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
});

// in-memory map to store guild-specific channels
const channelMap = new Map();

function getRandomHexColor() {
    const hex = Math.floor(Math.random() * 16777215).toString(16);
    return hex.padStart(6, '0');
}

async function getColorInfo() {
    const hex = getRandomHexColor();
    const res = await fetch(`https://www.thecolorapi.com/id?hex=${hex}`);
    const data = await res.json();

    return {
        name: data.name.value,
        hex: hex,
        rgb: data.rgb.value,
        image: data.image.bare,
    };
}

client.once('ready', () => {
    console.log(`Bot is online als ${client.user.tag}`);

    // schedule task every day at 15:00 (3 PM)
    cron.schedule('0 15 * * *', async () => {
        for (const [guildId, channelId] of channelMap.entries()) {
            try {
                const channel = await client.channels.fetch(channelId);
                if (!channel) continue;

                const kleur = await getColorInfo();

                const embed = new EmbedBuilder()
                    .setTitle(`🎨 Kleur van de Dag`)
                    .setDescription(`**${kleur.name}**\nHex: #${kleur.hex}\nRGB: ${kleur.rgb}`)
                    .setColor(`#${kleur.hex}`)
                    .setImage(kleur.image)
                    .setFooter({ text: 'Gegenereerd met TheColorAPI.com' });

                channel.send({ embeds: [embed] });
            } catch (err) {
                console.error(`Fout bij het sturen naar ${channelId}:`, err);
            }
        }
    });
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'setchannel') {
        if (!interaction.member.permissions.has('ManageGuild')) {
            return interaction.reply({
                content: 'Je hebt geen toestemming om dit commando te gebruiken (Beheer Server vereist).',
                ephemeral: true
            });
        }

        const channel = interaction.options.getChannel('channel');

        if (!channel || channel.type !== 0) {
            return interaction.reply({
                content: 'Kies een geldig tekstkanaal.',
                ephemeral: true
            });
        }

        channelMap.set(interaction.guild.id, channel.id);
        await interaction.reply(`✅ Dagelijkse kleur zal nu worden gepost in <#${channel.id}>.`);
    }
});

client.login(process.env.DISCORD_TOKEN);
