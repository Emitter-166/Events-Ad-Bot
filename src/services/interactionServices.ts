import { ActionRowBuilder, ButtonInteraction, ModalActionRowComponentBuilder, ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle } from "discord.js"
import { createAd, deleteAd } from "./adServices";

export const create_button = async (int: ButtonInteraction) => {
    try{
        const modal = new ModalBuilder()
            .setCustomId('events-ad-modal-create')
            .setTitle('Create Ad');

        const nameInput = new TextInputBuilder()
            .setCustomId('events-ad-input-create-name')
            .setLabel('name of ad')
            .setPlaceholder('Enter the name of the ad!')
            .setRequired(true)
            .setStyle(TextInputStyle.Short);
        
        const msgInput = new TextInputBuilder()
            .setCustomId('events-ad-input-create-msg')
            .setLabel('advertisement message')
            .setPlaceholder('foo bar!')
            .setRequired(true)
            .setStyle(TextInputStyle.Paragraph);
        
        const delayInput = new TextInputBuilder()
            .setCustomId('events-ad-input-create-delay')
            .setLabel('delay beween each ad')
            .setRequired(true)
            .setPlaceholder('Enter in mintues! e.g. 15')
            .setStyle(TextInputStyle.Short);

        const channelIdInput = new TextInputBuilder()
            .setCustomId('events-ad-input-create-channelId')
            .setLabel('channel Id')
            .setRequired(true)
            .setMinLength(15)
            .setValue('880331517291794442')
            .setStyle(TextInputStyle.Short);

        const nameRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(nameInput);
        const msgRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(msgInput);
        const delayRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(delayInput);
        const channelIdRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(channelIdInput);
        
        modal.addComponents(nameRow, msgRow, delayRow, channelIdRow);

        await int.showModal(modal);

    }catch(err: any){
        console.log("Err on /services/interactionServices/create_button()");
        console.log(err);
        throw new Error(err.message);
    }
}

export const delete_button = async (int: ButtonInteraction) => {
    try{
        const modal = new ModalBuilder()
        .setCustomId('events-ad-modal-delete')
        .setTitle('Delete Ad');

    const nameInput = new TextInputBuilder()
        .setCustomId('events-ad-input-delete-name')
        .setLabel('name of ad')
        .setPlaceholder('Enter the name of the ad!')
        .setRequired(true)
        .setStyle(TextInputStyle.Short);
    

    const nameRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(nameInput);
    
    modal.addComponents(nameRow);

    await int.showModal(modal);

    }catch(err: any){
        console.log("Err on /services/interactionServices/delete_button()");
        console.log(err);
        throw new Error(err.message);
    }
}

export const create_modal = async (int: ModalSubmitInteraction) => {
    try{
        const name = int.fields.getTextInputValue('events-ad-input-create-name').trim().replaceAll(" ", '-');
        const msg = int.fields.getTextInputValue('events-ad-input-create-msg');
        const delay = Number(int.fields.getTextInputValue('events-ad-input-create-delay')) * 60_000;
        const channelId = int.fields.getTextInputValue('events-ad-input-create-channelId');
        
        await createAd({name, delay, msg, channelId});
        int.reply({ephemeral: true, content: '✅'});

    }catch(err: any){
        console.log("Err on /services/interactionServices/create_modal()");
        console.log(err);
        int.reply({content: '⛔ something went wrong! error: \n ' + err.message, ephemeral: true});
        throw new Error(err.message);
    }
}

export const delete_modal = async (int: ModalSubmitInteraction) => {
    try{
        const name = int.fields.getTextInputValue('events-ad-input-delete-name').trim().replaceAll(" ", '-');
        await deleteAd({name});
        int.reply({ephemeral: true, content: '✅'});
    }catch(err: any){
        console.log("Err on /services/interactionServices/delete_modal()");
        console.log(err);
        int.reply({content: '⛔ something went wrong! error: \n ' + err.message, ephemeral: true});
        throw new Error(err.message);
    }
}