import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  CommandInteraction,
} from "discord.js";
import { SlashCommand } from "../types";
import { setUserOption } from "../function";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("setting")
    .setDescription("Cài đặt bot")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("database")
        .setDescription("Thêm database vào bot")
        .addStringOption((option) =>
          option
            .setName("link")
            .setDescription("Link database")
            .setRequired(true)
        )
    ),
  cooldown: 1,
  execute: async (interaction: CommandInteraction) => {
    if (!interaction.isChatInputCommand()) return;
    let link = interaction.options.getString("link", true);
    await setUserOption(interaction.user, "link", link);
    await interaction.reply("Đã thêm link database vào bot");
  },
};

export default command;
