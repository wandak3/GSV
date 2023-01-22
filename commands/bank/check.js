const {
    EmbedBuilder
} = require('discord.js');
const moment = require('moment-timezone');
const Donate = require("../../models/donate.js");
const Loan = require("../../models/loan.js");
module.exports = {
    name: "check",
    aliases: ['check'],
    usage: "Check bank donation.",
    moderator: false,
    timeout: 3000,
    async execute(message, args, commandName, client) {
        const donate = await Donate.findOne({
            _id: message.author.id
        });
        const loan = await Loan.findOne({
            _id: message.author.id
        });
        const embed = new EmbedBuilder()
            .setColor(9670107)
            .setAuthor({
                name: 'Twilight Pokémon Việt Nam',
                iconURL: "https://user-images.githubusercontent.com/116461839/201083708-05244c2f-354a-4e9d-8eba-df4528287e7e.gif"
            })
            .setTimestamp()
            .setFooter({
                text: message.author.tag
            });
        if (!donate) {
            embed.addFields({
                name: `Xin chào ${message.author.tag}`,
                value: "Xin lỗi nhưng Bank không tìm thấy dữ liệu của bạn ở trong hệ thống. Có thể do bạn chưa donate lần nào. Hãy donate ngay để đăng ký tạo tài khoản ngân hàng ở Twilight Pokémon Việt Nam để được hưởng nhiều quyền lợi đặc biệt nhé."
            });
            return await message.channel.send({
                embeds: [embed]
            });
        }
        const credit = donate.credit;
        const balance = donate.balance;
        const createdAt = moment(new Date(donate.createdAt)).tz("Asia/Saigon").format('DD/MM/YYYY');
        const updatedAt = moment(new Date(donate.updatedAt)).tz("Asia/Saigon").format('DD/MM/YYYY');
        embed.addFields({
            name: "Thông tin donate",
            value: `- Bạn đã donate: ${balance} <:pkc:1047212783072190484>
- Điểm tín dụng: ${credit} điểm
- Ngày đầu bạn donate: ${createdAt}
- Lần gần nhất donate: ${updatedAt}`
        }, );
        if (loan) {
            const current_loan = loan.balance;
            const payday = loan.payday;
            embed.addFields({
                name: "Thông tin vay mượn",
                value: `- Bạn đang vay: ${current_loan} <:pkc:1047212783072190484>
- Hạn trả: ${moment(new Date(payday)).tz("Asia/Saigon").format('DD/MM/YYYY')}`
            }, );
        }
        await message.channel.send({
            embeds: [embed]
        });
    }
};