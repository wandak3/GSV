import { 
    SlashCommandBuilder, 
    EmbedBuilder, 
    ButtonBuilder, 
    Attachment, 
    ActionRowBuilder, 
    ButtonStyle, 
    PermissionFlagsBits,
    Role,
    Guild
} from "discord.js";
import client from "../index";
import { GuildGiveaway, SlashCommand } from "../types";
import { pushGuildProperties } from "../function";
const command : SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("giveaway")
        .setDescription("Tạo Giveaway")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
            .setName('create')
            .setDescription('Tạo Giveaway.')
            .addStringOption(option =>
                option
                .setName('item')
                .setDescription('Vật phẩm Giveaway, tiêu đề Giveaway')
                .setMaxLength(1000)
                .setRequired(true)
            )
            .addNumberOption(option => 
                option
                .setName('duration')
                .setDescription('Thời gian Giveaway.')
                .addChoices(
                    {
                        name: '1 hour',
                        value: 3600000
                    }, 
                    {
                        name: '3 hours',
                        value: 10800000
                    }, 
                    {
                        name: '1 day',
                        value: 86400000
                    }, 
                    {
                        name: '3 days',
                        value: 259200000
                    }
                )
                .setRequired(true)
            )
            .addRoleOption(option =>
                option
                .setName('role')
                .setDescription('Role cần thiết để tham gia vào Giveaway')
                .setRequired(true)
            )
            .addIntegerOption(option =>
                option.setName('winner')
                .setDescription('Số người thắng, mặc định là 1')
            )
            .addStringOption(option =>
                option.setName('requirement')
                .setDescription('Yêu cầu của buổi Giveaway.')
            )
            .addStringOption(option =>
                option.setName('description')
                .setDescription('Mô tả về Giveaway')
            )
            .addAttachmentOption(option =>
                option
                .setName("image")
                .setDescription("Thêm hình ảnh Giveaway")
            )
        ),
    cooldown: 10,
    execute: async (interaction): Promise<void> => {
        if (!interaction.isChatInputCommand()) return;
        if (interaction.options.getSubcommand() == 'create') {
            const item = interaction.options.getString('item') as string;
            const duration = interaction.options.getNumber('duration') as number;
            const role = interaction.options.getRole('role') as Role;

            const winner = interaction.options.getInteger('winner') as number ?? 1;
            const requirement = interaction.options.getString('requirement') as string ?? 'Không có';
            const description = interaction.options.getString('description') as string ?? `Buổi giveaway của ${interaction.user.tag}` as string;
            const image = interaction.options.getAttachment('image') as Attachment ?? undefined;

            const endTime = Date.now() + duration;

            const giveawayEmbed = new EmbedBuilder();
            giveawayEmbed.setColor(0xffffff);
            giveawayEmbed.setAuthor(
                {
                    name: 'Twilight Pokémon Việt Nam',
                    iconURL: 'https://user-images.githubusercontent.com/116461839/201083708-05244c2f-354a-4e9d-8eba-df4528287e7e.gif'
                }
            );
            giveawayEmbed.setTitle(item);
            giveawayEmbed.setDescription(`Thời gian: ${duration/60/60/1000} giờ.\nSố người tham gia: \`0\``);
            giveawayEmbed.addFields(
                {
                    name: 'Cấu hình của Giveaway',
                    value: `Role yêu cầu: ${role}.\nSố người thắng: ${winner}.\nRequirements: ${requirement}.\nMô tả: ${description}.`
                }
            );
            giveawayEmbed.setTimestamp(endTime)
            giveawayEmbed.setFooter(
                {
                    text: 'Thời gian kết thúc giveaway: '
                }
            );
            if (image) {
                giveawayEmbed.setImage(image.url)
            }
            const button_join_giveaway = new ActionRowBuilder<ButtonBuilder>();
            button_join_giveaway.addComponents(
                    new ButtonBuilder()
                    .setCustomId('joinGiveaway|' + interaction.id)
                    .setLabel('Tham gia giveaway')
                    .setStyle(ButtonStyle.Success),
            );
            const giveawayCreate: GuildGiveaway = {
                id: interaction.id,
                time: endTime,
                channel: interaction.channel!,
                entries: []
            }
            await pushGuildProperties(interaction!.guild as Guild, 'giveawayList', giveawayCreate);
            await interaction.reply(
                {
                    embeds: [giveawayEmbed],
                    components: [button_join_giveaway]
                }
            );
        }
    }
}

export default command;