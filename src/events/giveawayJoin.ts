import { GuildMemberRoleManager, Interaction } from "discord.js";
import { BotEvent, GuildGiveaway } from "../types";
import { getBonusEntries, getGiveaway, getGuildProperties, updateGiveawayEntries } from "../function";
import { Guild } from "discord.js";

const event : BotEvent = {
    name: "interactionCreate",
    execute: async (interaction: Interaction) => {
        if (!interaction.isButton()) return;
        if (interaction.customId.includes('joinGiveaway')) {
            let giveaways = await getGuildProperties(interaction.guild, 'giveawayList');
            let bonusList = await getGuildProperties(interaction.guild, 'bonusList');
            let giveaway = getGiveaway(giveaways, interaction.customId);
            if (!giveaway) return;
            let found_entry = giveaway.entries.find(entry => {
                return entry === interaction.user.id
            });
            let bonus = getBonusEntries(bonusList, interaction.member!.roles as GuildMemberRoleManager, interaction.user);
            if (!found_entry) {
                for (let i = 0; i < bonus; i++) {
                    giveaway?.entries.push(interaction.user.id);
                }
                await updateGiveawayEntries(interaction!.guild as Guild, giveaway!);
                await interaction.reply({
                    content: 'Tham gia thành công. Bạn đã tham gia thành công vào buổi Giveaway.',
                    ephemeral: true
                });
            } else {
                await interaction.reply({
                    content: 'Tham gia thất bại. Bạn đã có tên trong danh sách Giveaway rồi.',
                    ephemeral: true
                });
            }
        }
    }
}

export default event;