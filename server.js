import dotenv from 'dotenv';
dotenv.config();

import { Client, GatewayIntentBits, EmbedBuilder } from 'discord.js';
import fetch from 'node-fetch';
import cron from 'node-cron';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
});

//Random kleur ophalen via Color API
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

// timer om 3 uur smiddags
client.once('ready', () => {
    console.log(`Bot is online als ${client.user.tag}`);

    cron.schedule('0 15 * * *', async () => {
        const channelId = 'Daily_color';
        const channel = await client.channels.fetch(channelId);

        const kleur = await getColorInfo();

        const embed = new EmbedBuilder()
            .setTitle(`🎨 Kleur van de Dag`)
            .setDescription(`**${kleur.name}**\nHex: #${kleur.hex}\nRGB: ${kleur.rgb}`)
            .setColor(`#${kleur.hex}`)
            .setImage(kleur.image)
            .setFooter({ text: 'Gegenereerd met TheColorAPI.com' });

        channel.send({ embeds: [embed] });
    });
});

client.login(process.env.DISCORD_TOKEN);
