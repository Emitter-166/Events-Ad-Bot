import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Message } from "discord.js";
import { sequelize } from "..";

export const events_ad = async (msg: Message) => {
    try{
        const embed = new EmbedBuilder();
        const ads_model = sequelize.model('ads');
        let description = '';
    
        const ads_all = await ads_model.findAll();
    
        let i = 0;
        for(const ad of ads_all){
            i++;
            const {name, lastSentAt, delay, channelId} = ad.dataValues;
    
            const lastSentAtText = lastSentAt+"";
            const time = lastSentAtText.slice(0, lastSentAtText.length -3);
    
            description += `**${i}. ${name} last: <t:${time}:R> every: ${delay/60_000} min on: <#${channelId}>** \n`
        }
    
        embed.setDescription(description);
    
        const rows = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('create')
                    .setCustomId('events-ad-button-create')
                    .setStyle(ButtonStyle.Success),
    
                new ButtonBuilder()
                    .setLabel('delete')
                    .setCustomId('events-ad-button-delete')
                    .setStyle(ButtonStyle.Danger)
            )
    
        await msg.reply({embeds: [embed], components: [rows], allowedMentions: {repliedUser: false}});
    }catch(err: any){
        console.log("Err on services/commandServices/events_ad()");
        console.log(err);
        throw new Error(err.message);
    }
}