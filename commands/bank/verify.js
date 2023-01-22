const {
    EmbedBuilder
} = require('discord.js');
const Donate = require("../../models/donate.js");

module.exports = {
    name: "verify",
    aliases: ['verify'],
    usage: "Verify if you have donate sufficient ammount to gain role.",
    moderator: false,
    timeout: 3000,
    async execute(message, args, commandName) {
        const embed = new EmbedBuilder()
            .setColor(9670107)
            .setTitle("Xác nhận role")
            .setAuthor({
                name: 'Twilight Pokémon Việt Nam',
                iconURL: "https://user-images.githubusercontent.com/116461839/201083708-05244c2f-354a-4e9d-8eba-df4528287e7e.gif"
            })
            .setTimestamp()
            .setFooter({
                text: message.author.tag
            });
        const donate = await Donate.findOne({
            _id: message.author.id
        });
        if (!donate) {
            embed.setDescription(`Xin chào <@${message.author.id}>, bạn chưa donate <:pkc:1047212783072190484> cho bank nên chưa thể nhận role.`);
            return await message.channel.send({ embeds: [embed] });
        }
        var balance = donate.balance;
        const Donor = message.guild.roles.cache.get("773778739515228160");
        const BigDonor = message.guild.roles.cache.get("773780261435211798");
        const KingDonor = message.guild.roles.cache.get("773785405874634802");
        if (balance >= 50000 && balance < 100000) {
            embed.setDescription(addRole(message, [Donor], balance, embed));
        } else if (balance >= 100000 && balance < 300000) {
            embed.setDescription(addRole(message, [Donor, BigDonor], balance, embed));
        } else if (balance >= 300000) {
            embed.setDescription(addRole(message, [Donor, BigDonor, KingDonor], balance));
        } else {
            embed.setDescription(addRole(message, undefined, balance, embed));
        }
        return await message.channel.send({ embeds: [embed] });
    }
};

function addRole(message, role, balance, embed) {
    if (role == undefined) return `Xin chào ${message.author.tag}, bạn còn cần **${50000-balance}** <:pkc:1047212783072190484> để nhận được **Donor** role.`;
    for (let i = 0; i < role.length; i++) {
        if (!message.member.roles.cache.has(role[i].id)) message.member.roles.add(role[i]).catch(console.error);
    }
    if (role.length == 1) return `Chúc mừng ${message.author.tag}, bạn đã có **@Donor** role.`;
    else if (role.length == 2) return `Chúc mừng ${message.author.tag}, bạn đã có **@Big Donor**  role.`;
    else return `Chúc mừng ${message.author.tag}, bạn đã có **@King Donor**  role.`;
}