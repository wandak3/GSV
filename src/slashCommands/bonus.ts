import { 
    SlashCommandBuilder,
    PermissionFlagsBits,
    Guild,
    Role
} from "discord.js";
import { BonusEntries, SlashCommand } from "../types";
import { getGuildProperties, pullGuildProperties, pushGuildProperties, updateBonusEntries } from "../function";

const command : SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("bonus")
        .setDescription("Bonus Entry cho buổi giveaway.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
            .setName('add')
            .setDescription('Thêm một role vào danh sách bonus entry.')
            .addRoleOption(option =>
                option
                .setName('role')
                .setDescription('Bạn muốn thêm role nào vào danh sách bonus?')
                .setRequired(true)
            )
            .addNumberOption(option =>
                option
                .setName('bonus')
                .setDescription('Bạn muốn thêm bao nhiêu bonus cho role này?')
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand =>
            subcommand
            .setName('remove')
            .setDescription('Xoá một role khỏi danh sách bonus entry.')
            .addRoleOption(option =>
                option
                .setName('role')
                .setDescription('Bạn muốn xoá role nào khỏi danh sách bonus?')
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand =>
            subcommand
            .setName('view')
            .setDescription('Hiển thị các role có bonus.')
        ),
    cooldown: 2,
    execute: async (interaction): Promise<void> => {
        if (!interaction.isChatInputCommand()) return;
        let bonusList = await getGuildProperties(interaction.guild, 'bonusList') as BonusEntries[];
        if (interaction.options.getSubcommand() == 'add') {
            const add_role = interaction.options.getRole('role') as Role;
            const add_bonus = interaction.options.getNumber('bonus') as number;

            const BonusRole: BonusEntries = {
                roleid: add_role.id,
                bonus: add_bonus
            }
            const found = bonusList?.find(role => {
                return role.roleid === add_role.id;
            });

            if (!bonusList || !found) {
                await pushGuildProperties(interaction!.guild as Guild, 'bonusList', BonusRole);
            } else {
                await updateBonusEntries(interaction!.guild as Guild, BonusRole)
            }

            await interaction.reply({
                content: `Update ${add_role} with ${add_bonus} successfully.`
            });
        
        } else if (interaction.options.getSubcommand() == 'remove') {
            const remove_role = interaction.options.getRole('role') as Role;

            const RemoveBonusRole: BonusEntries = {
                roleid: remove_role.id,
                bonus: 1
            }
            const found = bonusList?.find(role => {
                return role.roleid === remove_role.id;
            });
            var content: string;
            if (!bonusList || !found) {
                content = `Remove ${remove_role} failed. This role does not exist in database.`
            } else {
                content = `Remove ${remove_role} successfully.`
                await pullGuildProperties(interaction!.guild as Guild, 'bonusList', 'roleid', remove_role.id);
            }
            await interaction.reply({
                content: content
            });
        } else if (interaction.options.getSubcommand() == 'view') {

        }
    }
}

export default command;