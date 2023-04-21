import { Sequelize, INTEGER, STRING, CHAR } from "sequelize";

export const model = (sequelize: Sequelize) => {
    sequelize.define('ads', {
        name: {
            type: STRING,
            allowNull: false
        },
        msg: {
            type: STRING,
            allowNull: false
        },
        delay: {
            type: INTEGER,
            defaultValue: 3600000
        },
        lastSentAt: {
            type: INTEGER,
            defaultValue: 0
        },
        channelId: {
            type: CHAR(25),
            defaultValue: '880331517291794442'
        }
    }, {timestamps: false})
}