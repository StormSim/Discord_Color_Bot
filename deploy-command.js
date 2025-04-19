import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

const commands = [
  new SlashCommandBuilder()
    .setName('setchannel')
    .setDescription('Stel het kanaal in voor de kleur van de dag')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('Het kanaal waarin het bericht wordt verzonden')
        .setRequired(true)
    )
    .toJSON()
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('📡 Slash commands aan het registreren...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID), // voeg toe aan je .env
      { body: commands }
    );
    console.log('✅ Slash commands geregistreerd!');
  } catch (error) {
    console.error(error);
  }
})();
