import { ButtonInteraction, Client, GuildMember, ModalSubmitInteraction } from "discord.js";
import { create_button, create_modal, delete_button, delete_modal } from "../services/interactionServices";

export = (client: Client) => {
    client.on('interactionCreate', async (interaction) => {
        
        const member = interaction.member as GuildMember;
        
        if(!member.permissions.has('Administrator') && !member.roles.cache.has('989322114735693858')) return;
        try{
            if(interaction.isButton()){
                const int = interaction as ButtonInteraction;
                const customId = int.customId;
                if(!customId.startsWith('events-ad-button')) return;
                
                customId.endsWith('create') ? await create_button(int) : await delete_button(int);
                

            }else if(interaction.isModalSubmit()){
                const int = interaction as ModalSubmitInteraction;
                const customId = int.customId;
                if(!customId.startsWith('events-ad-modal')) return;   
                customId.endsWith('create') ? await create_modal(int) : await delete_modal(int);
            }

        }catch(err){
            console.log("Error on /events/messageCreate.ts");
            console.log(err);
        }
    })
}