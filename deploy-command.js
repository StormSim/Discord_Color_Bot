import { REST, Routes, SlashCommandBuilder } from "discord.js"
import dotenv from "dotenv"
dotenv.config()

const commands = [
  new SlashCommandBuilder()
    .setName("setchannel")
    .setDescription("Set the channel for daily color messages")
    .addChannelOption((option) => option.setName("channel").setDescription("Select a channel").setRequired(true))
    .toJSON(),
  new SlashCommandBuilder()
    .setName("setrole")
    .setDescription("Set the role to mention with the daily message")
    .addRoleOption((option) => option.setName("role").setDescription("Select a role").setRequired(true))
    .toJSON(),
  new SlashCommandBuilder().setName("ping").setDescription("Check if the bot is responding").toJSON(),
  new SlashCommandBuilder()
    .setName("status")
    .setDescription("Check the current bot configuration for this server")
    .toJSON(),
  new SlashCommandBuilder().setName("help").setDescription("Get help with using the Color Bot").toJSON(),
  new SlashCommandBuilder().setName("backup").setDescription("Get a backup of all bot settings (Admin only)").toJSON(),
]

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN)
;(async () => {
  try {
    console.log("📡 Registering slash commands globally...")
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID), // Register globally
      { body: commands },
    )
    console.log("✅ Slash commands registered globally!")
  } catch (error) {
    console.error("Failed to register commands:", error)
  }
})()
