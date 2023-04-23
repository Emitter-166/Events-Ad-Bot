import { ButtonInteraction, Client, GuildMember, ModalSubmitInteraction } from "discord.js";

export = (client: Client) => {
    client.on('interactionCreate', async (interaction) => {
        const member = interaction.member as GuildMember;
        if(!member.permissions.has('Administrator') || !member.roles.cache.has('989322114735693858')) return;

        try{
            if(interaction.isButton()){
                const int = interaction as ButtonInteraction;
                const customId = int.customId;
                if(!customId.startsWith('events-ad-button')) return;
                const createButton = customId.endsWith('create');

            }else if(interaction.isModalSubmit()){
                const int = interaction as ModalSubmitInteraction;
                const customId = int.customId;
                if(!customId.startsWith('events-ad-modal')) return;       
            }

        }catch(err){
            console.log("Error on /events/messageCreate.ts");
            console.log(err);
        }
    })
}