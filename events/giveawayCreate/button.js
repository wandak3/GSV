const {
    Events,
    EmbedBuilder
} = require('discord.js');
const Giveaway = require("../../models/giveaway.js");
const Reroll = require("../../models/reroll.js");
module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        if (!interaction.isButton()) return;
        if (interaction.customId.includes("join_giveaway")) {
            const _id = interaction.customId.replace("join_giveaway|", "");
            const giveawayDB = client.giveaway;
            let giveaway = "";
            for (let i = 0; i < giveawayDB.length; i++) {
                if (giveawayDB[i]._id === _id) {
                    giveaway = giveawayDB[i];
                }
            }
            let join = giveaway.join;
            if(!join) return;
            if (join.includes(interaction.user.id)) return await interaction.reply({
                content: 'Tham gia thất bại. Bạn đã có tên trong buổi Giveaway này.',
                ephemeral: true
            });
            const roles = interaction.member.roles.member._roles;
            const _allowRoles = [giveaway.role, "773785405874634802","773780261435211798","813047480413454359", "773778739515228160"];
            let allow = false;
            _allowRoles.forEach(async item => {
                if(interaction.member.roles.cache.has(item) === true) {
                    allow = true;
                }
            });
            if (!allow) return await interaction.reply({
                content: `Tham gia thất bại. Bạn không có role <@&${giveaway.role}>.`,
                ephemeral: true
            });
            const _roles = ["773785405874634802","773780261435211798","813047480413454359", "773778739515228160"]; //+3, +2, +2, +1
            let role_counter = 1;
            for (let i = 0; i < roles.length; i++) {
                if (roles[i] === _roles[0]) {
                    role_counter += 3;
                } else if (roles[i] === _roles[1]) {
                    role_counter += 2;
                } else if (roles[i] === _roles[2]) {
                    role_counter += 2;
                } else if (roles[i] === _roles[3]) {
                    role_counter += 1;
                }
            }

            for (var i = 0; i < role_counter; i++) {
                join.push(interaction.user.id);
            }
            await Giveaway.findOneAndUpdate({
                _id: _id
            }, {
                $set: {
                    join: join
                }
            });
            client.giveaway = await Giveaway.find();
            return await interaction.reply({
                content: 'Bạn đã tham gia thành công buổi Giveaway.',
                ephemeral: true
            });
        } else if (interaction.customId.includes("reroll")) {
            const _moderatorRoles = ["912330014702313492","805707274530062356","1035041217756545064"];
            let allow = false;
            _moderatorRoles.forEach(async item => {
                if(interaction.member.roles.cache.has(item) === true) {
                    allow = true;
                }
            });
            if(!allow) return await interaction.reply({ content: 'Bạn không có quyền để sử dụng lệnh này', ephemeral: true });
            const _id = interaction.customId.replace("reroll|", "");
            const giveaway = await Reroll.findOne({
                _id: _id
            });
            const title = giveaway?.title;
            const thumbnail = giveaway?.thumbnail;
            let join = giveaway.join;
            let winner = giveaway.winner;
            let winner_list = [];
            for (let j = 0; j < winner; j++) {
                let rand = random(0, join.length - 1);
                winner_list.push(join[rand]);
                join = join.filter(item => item !== join[rand]);
            }
            let description = "";
            for (let i = 0; i < winner_list.length; i++) {
                description += `Chúc mừng <@${winner_list[i]}>, bạn đã trúng giải thưởng ${title.replace("","")}.\n`;
            }
            const editEmbed = new EmbedBuilder()
                .setThumbnail(thumbnail)
                .setColor(0xffffff)
                .setTimestamp()
                .setDescription(description)
                .setAuthor({
                    name: 'Twilight Pokémon Việt Nam',
                    iconURL: 'https://user-images.githubusercontent.com/116461839/201083708-05244c2f-354a-4e9d-8eba-df4528287e7e.gif'
                })
                .setTitle('Danh sách trúng Giveaway')
                .setFooter({
                    text: 'Twilight Pokémon Việt Nam'
                });
            await interaction.deferUpdate();
            await interaction.editReply({
                content: "Reroll thành công.",
                embeds: [editEmbed]
            });
        }
    }
};

function random(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}