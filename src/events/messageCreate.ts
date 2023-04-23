import { Client, PermissionFlagsBits } from "discord.js";
import { events_ad } from "../services/commandServices";

export = (client: Client) => {
    client.on('messageCreate', async (msg) => {
        try{
            if(!(msg.content.toLowerCase() === '!events-ad')) return;
            if(!msg.member?.permissions.has(PermissionFlagsBits.Administrator) && !msg.member?.roles.cache.has('989322114735693858')) return;
            await events_ad(msg);
        }catch(err){
            console.log("Error on /events/messageCreate.ts");
            console.log(err);
        }
    })
}