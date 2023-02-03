import { 
    SlashCommandBuilder, 
    EmbedBuilder, 
    ButtonBuilder, 
    Attachment, 
    ActionRowBuilder, 
    ButtonStyle, 
    PermissionFlagsBits
} from "discord.js";
import client from "../index";
import { SlashCommand } from "../types";
var [ _trainer, _master, _booster, _donor, _bigdonor, _kingdonor ] = 
[
    '936835632695762954',
    '936833835944009809',
    '813047480413454359',
    '773778739515228160',
    '773780261435211798',
    '773785405874634802'
];
const command : SlashCommand = {
    command: new SlashCommandBuilder()
        .setName("giveaway")
        .setDescription("Tạo giveaway")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand
            .setName('create')
            .setDescription('Tạo giveaway.')
            .addStringOption(option =>
                option
                .setName('item')
                .setDescription('Vật phẩm giveaway, tiêu đề giveaway')
                .setMaxLength(1000)
                .setRequired(true)
            )
            .addNumberOption(option => 
                option
                .setName('duration')
                .setDescription('Thời gian giveaway.')
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
            .addStringOption(option =>
                option.setName('role')
                .setDescription('Role để tham gia Giveaway')
                .setRequired(true)
                .addChoices(
                    {
                        name: 'Pokémon Trainer',
                        value: _trainer
                    }, 
                    {
                        name: 'Pokémon Master',
                        value: _master
                    }, 
                    {
                        name: 'Server Booster',
                        value: _booster
                    }, 
                    {
                        name: 'Donor',
                        value: _donor
                    }, 
                    {
                        name: 'Big Donor',
                        value: _bigdonor
                    }, 
                    {
                        name: 'King Donor',
                        value: _kingdonor
                    }
                )
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
                .setDescription('Mô tả về giveaway')
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
            const role = interaction.options.getString('role') as string;

            const winner = interaction.options.getInteger('winner') as number ?? 1;
            const requirement = interaction.options.getString('requirement') as string ?? '';
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
            giveawayEmbed.setDescription(`Thời gian: ${duration/60/60/1000} giờ.\nNgười tham gia: \`0\``);
            giveawayEmbed.addFields(
                {
                    name: 'Giveaway',
                    value: `Role yêu cầu: <@&${role}>.\nSố người thắng: ${winner}.`
                }
            );
            giveawayEmbed.setTimestamp(endTime)
            giveawayEmbed.setFooter(
                {
                    text: 'Thời gian kết thúc giveaway: '
                }
            );
            const button_join_giveaway = new ActionRowBuilder<ButtonBuilder>();
            button_join_giveaway.addComponents(
                    new ButtonBuilder()
                    .setCustomId('joinGiveaway|' + interaction.id)
                    .setLabel('Tham gia giveaway')
                    .setStyle(ButtonStyle.Success),
            );
            client.emit('giveawayCreate', interaction);
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