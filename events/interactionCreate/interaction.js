const { Events } = require('discord.js');
module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;
    	const command = interaction.client.commands.get(interaction.commandName);
    	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
    	}
    	
    	const moderator = command.moderator;
        if(moderator === true) {
            const _moderatorRoles = ["912330014702313492","805707274530062356","1035041217756545064", "1044130637583499314"];
            let allow = false;
            _moderatorRoles.forEach(async item => {
                if(interaction.member.roles.cache.has(item) === true) {
                    allow = true;
                }
            });
            
            if(!allow) return await interaction.reply({ content: 'Bạn không có quyền để sử dụng lệnh này', ephemeral: true });
        }
    
    	try {
    		await command.execute(interaction, client);
    	} catch (error) {
    		console.error(error);
    		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    	}
    	
    }
};