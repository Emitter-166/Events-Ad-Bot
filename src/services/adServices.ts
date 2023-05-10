import { Model, } from "sequelize";
import { client, sequelize } from ".."
import { AttachmentBuilder, GuildTextBasedChannel } from "discord.js";

export const createAd = async (body: {name: string, delay: number, msg: string, channelId: string}): Promise<any> => {
    const t = await sequelize.transaction({autocommit: false})
    try{
        const ads_model = sequelize.model('ads');

        const [model, created] = await ads_model.findOrCreate({
            where: {
                name: body.name
            },
            defaults: {
                ...body
            },
            transaction: t
        })

        try{
            await t.commit()
        }catch(err: any){
            await t.rollback()
            throw new Error('an error while trying to commit this to the database')
        }

        if(created){
            return model.dataValues;
        }else{
            throw new Error ('ad already exists!')
        }
    }catch(err: any){
        await t.rollback()
        console.log("Err at services/adServices/createAd()");
        console.log(err);
        throw new Error(err.message) 
    }
}

export const deleteAd = async (body: {name: string}) => {
    const t = await sequelize.transaction({autocommit: false});

    try{
        const ads_model = sequelize.model('ads');

        const model = await ads_model.findOne({
            where: {...body},
            transaction: t
        })

        if(!model) throw new Error('ad not found.')

        const res = await model.destroy({transaction: t});

        try{
            await t.commit()
        }catch(err: any){
            await t.rollback()
            throw new Error('an error while trying to commit this to the database')
        }

        return 'success';
    }catch(err: any){
        await t.rollback()
        console.log("Err at services/adServices/deleteAd()");
        console.log(err);
        throw new Error(err.message)
    }
}

export const availableAds = async (): Promise<Model<any, any>[]> => {
    try{
        const ads_model = sequelize.model('ads');

        const all = (await ads_model.findAll({})).filter((v) => {
            const {lastSentAt, delay} = v.dataValues;
            return (Date.now() - lastSentAt) >= delay;
        })

        return all;
    }catch(err: any){
        console.log("Err at services/adServices/availableAds()");
        console.log(err);
        throw new Error(err.message);
    }
}

export const sendAd = async (ad: Model<any, any>) => {
    try{
        const {msg, channelId} = ad.dataValues;
        if(!msg || !channelId) throw new Error('invalid model provided');

        if(!client.isReady()) throw new Error('client hasn\'t started yet!');

        const channel = await client.channels.fetch(channelId) as GuildTextBasedChannel;

        const msg_arr: string [] = msg.split(':');

        const raw_message = msg_arr[Math.floor(Math.random() * msg_arr.length)];
        let img_links = raw_message.split(" ").filter(word => word.startsWith('https://') && (word.endsWith('.png') || word.endsWith('.jpg')) )

        let content = raw_message;
        for (const link of img_links) {
            content = content.replace(link, '');
        }

        let attachments: AttachmentBuilder[] = [];

        for (const link of img_links) {
            const response = await fetch(link);
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            
            const attachment = new AttachmentBuilder(buffer);
            attachments.push(attachment);
        }

        await channel.send({
            content,
            files: attachments
        });


        return (await ad.update({
            lastSentAt: Date.now()
        })).dataValues;

    }catch(err: any){
        console.log('Err at services/adServices/sendAd()');
        console.log(err);
        throw new Error(err.message)
    }
}

export const scanAds = () => {
    const ads_model = sequelize.model('ads');
    setInterval(async () => {
        try{
            const available_Ads = await availableAds();
            
            for(const ad of available_Ads){
                await sendAd(ad);
            }
            
        }catch(err){
            console.log("Err at services/adServices/scanAds()");
            console.log(err);
        }
    }, 15_000);
}