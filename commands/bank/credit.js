const {
    EmbedBuilder
} = require('discord.js');
const Donate = require("../../models/donate.js");

module.exports = {
    name: "credit",
    aliases: ['credit'],
    usage: "Adjust user credit in bank.",
    moderator: true,
    timeout: 2000,
    async execute(message, args, commandName) {
        const embed = new EmbedBuilder()
            .setColor(9670107)
            .setAuthor(null);

        if (!args.length) {
            embed.setDescription("Thiếu thông tin người dùng.");
            return await message.channel.send({
                embeds: [embed]
            });
        }

        const arg = args.map(removeMention);
        var player = arg.filter(item => isNaN(item) == false && item > 9999999999);
        var number = args.filter(item => isNaN(item) == false && item < 100);
        var increment = args.filter(item => isNaN(item) == true && (item == "+" || item == "-"));

        if (!player.length) {
            embed.setDescription("Người dùng không hợp lệ.");
            return await message.channel.send({
                embeds: [embed]
            });
        } else if (!increment.length) {
            embed.setDescription("Sử dụng '+' để tăng tín dụng, '-' để giảm tín dụng. Cách dấu khỏi số.");
            return await message.channel.send({
                embeds: [embed]
            });
        } else if (!number.length) {
            embed.setDescription("Số điểm không hợp lệ.");
            return await message.channel.send({
                embeds: [embed]
            });
        }

        const donate = await Donate.findOne({
            id: String(player.join())
        });
        if (!donate) {
            embed.setDescription("Không tìm thấy người dùng.");
            return await message.channel.send({
                embeds: [embed]
            });
        }
        let credit = donate.credit;
        switch (increment[0]) {
            case "+":
                if (credit >= 100) {
                    embed.setDescription(`Không thể cộng thêm, do 100 điểm tín dụng là tối đa.`);
                    return await message.channel.send({
                embeds: [embed]
            });
                }
                credit += number[0];
                embed.setDescription(`Đã cộng thêm ${number[0]} điểm tín dụng.`);
                break;
            case "-":
                if (credit < 30) {
                    embed.setDescription(`Không thể trừ nữa, do 30 điểm tín dụng là quá thấp.`);
                    return await message.channel.send({
                embeds: [embed]
            });
                }
                credit -= number[0];
                embed.setDescription(`Đã trừ đi ${number[0]} điểm tín dụng.`);
                break;
            default:
                embed.setDescription(`Sử dụng sai ký hiệu. Xin bạn thử lại.`);
        }
        await Donate.findOneAndUpdate({
            _id: String(player.join()),
        }, {
            $set: {
                credit: Number(credit)
            }
        }, {
            new: false
        });
        return await message.channel.send({
                embeds: [embed]
            });
    }
};

function removeMention(index) {
    return index.replace(/[&\/\\#,+()$~%.'":*?<>{}@]/g, '');
}