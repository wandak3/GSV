import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  CommandInteraction,
  EmbedBuilder,
} from "discord.js";
import { SlashCommand } from "../types";
import { eventChoices } from "../data/events";
import { characterChoices } from "../data/character";
import { weaponChoices } from "../data/weapon";
import { findGachaData, updateGachaScheduleConfig } from "../function";
import moment, { DurationInputArg1, DurationInputArg2 } from "moment";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("add")
    .setDescription("Thêm vào server")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("event")
        .setDescription("Thêm event vào server")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("Tên event")
            .setRequired(true)
            .setAutocomplete(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("character")
        .setDescription("Thêm sự kiện cầu nguyện vào server")
        .addStringOption((option) =>
          option
            .setName("5star")
            .setDescription("Tên nhân vật 5 sao")
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addStringOption((option) =>
          option
            .setName("start")
            .setDescription(
              "Đặt thời gian bắt đầu cho sự kiện. Mặc định là hôm nay."
            )
        )
        .addStringOption((option) =>
          option
            .setName("end")
            .setDescription(
              "Đặt thời gian kéo dài cho sự kiện (1d, 2w, 3m, 4y). Mặc định là 2 tuần (2w)"
            )
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("custom")
        .setDescription("Thêm sự kiện cầu nguyện cá nhân hóa vào server")
        .addStringOption((option) =>
          option
            .setName("5star")
            .setDescription("Tên nhân vật 5 sao")
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addStringOption((option) =>
          option
            .setName("4stars1")
            .setDescription("Tên nhân vật 4 sao thứ 1")
            .setAutocomplete(true)
        )
        .addStringOption((option) =>
          option
            .setName("4stars2")
            .setDescription("Tên nhân vật 4 sao thứ 2")
            .setAutocomplete(true)
        )
        .addStringOption((option) =>
          option
            .setName("4stars3")
            .setDescription("Tên nhân vật 4 sao thứ 3")
            .setAutocomplete(true)
        )
        .addStringOption((option) =>
          option
            .setName("start")
            .setDescription("Đặt thời gian bắt đầu cho sự kiện.")
        )
        .addStringOption((option) =>
          option
            .setName("end")
            .setDescription("Đặt thời gian kéo dài cho sự kiện.")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("weapon")
        .setDescription("Thêm vũ khí vào sự kiện cầu nguyện vào server")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("Tên vũ khí")
            .setRequired(true)
            .setAutocomplete(true)
        )
    ),
  cooldown: 1,
  autocomplete: async (interaction) => {
    if (interaction.options.getSubcommand() === "event") {
      try {
        const focusedOption = interaction.options.getFocused(true);
        let filtered: { value: string; name: string }[] = eventChoices.filter(
          (choice) => {
            return choice.name.includes(focusedOption.value);
          }
        );
        let options = filtered.length > 25 ? filtered.slice(0, 25) : filtered;
        await interaction.respond(options);
      } catch (error) {
        console.log(`Error: ${error.message}`);
      }
    } else if (interaction.options.getSubcommand() === "character") {
      try {
        const focusedOption = interaction.options.getFocused(true);
        let filtered: { value: string; name: string; remark?: string }[] =
          characterChoices.filter((choice) => {
            if (focusedOption.name === "5star")
              return (
                choice.name.includes(focusedOption.value) &&
                choice.remark === "5"
              );
            return (
              choice.name.includes(focusedOption.value) && choice.remark === "4"
            );
          });
        let options = filtered.length > 25 ? filtered.slice(0, 25) : filtered;
        await interaction.respond(options);
      } catch (error) {
        console.log(`Error: ${error.message}`);
      }
    } else if (interaction.options.getSubcommand() === "weapon") {
      try {
        const focusedOption = interaction.options.getFocused(true);
        let filtered: { value: string; name: string }[] = weaponChoices.filter(
          (choice) => {
            return choice.name.includes(focusedOption.value);
          }
        );
        let options = filtered.length > 25 ? filtered.slice(0, 25) : filtered;
        await interaction.respond(options);
      } catch (error) {
        console.log(`Error: ${error.message}`);
      }
    }
  },
  execute: async (interaction: CommandInteraction) => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.options.getSubcommand() === "event") {
    } else if (interaction.options.getSubcommand() === "character") {
      const fiveStar = interaction.options.getString("5star", true);
      const startDate = interaction.options.getString("start") ?? undefined;
      const endTime = interaction.options.getString("end") ?? "";
      var letters = endTime.match(/[a-zA-Z]/g) ?? ["w"];
      var digits = endTime.match(/[0-9]/g) ?? ["2"];
      const endDate = moment(
        startDate,
        "DD-MM-YYYY hh:mm:ss",
        "Asia/Ho_Chi_Minh"
      )
        .add(
          digits[0] as DurationInputArg1,
          letters[0].toUpperCase() as DurationInputArg2
        )
        .toDate();
      const gacha = findGachaData(fiveStar);

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: "XXX.XX",
              iconURL: "https://i.imgur.com/XXXX.png",
            })
            .setTitle("XXXX")
            .setThumbnail("https://i.imgur.com/XXX.png")
            .setDescription("discord bot developed by <@XXXXXXXXX>.")
            .addFields({
              name: "Application Commands",
              value: "`/help`, `/XXX`, `/xxx`, `/xx`, `/xx`",
            })
            .setTimestamp()
            .setImage("https://i.imgur.com/XXXXX.png")
            .setFooter({
              text: "Powered by XXXX",
              iconURL: interaction.client.user?.avatarURL() || undefined,
            }),
        ],
      });
    } else if (interaction.options.getSubcommand() === "weapon") {
    }
  },
};

export default command;
