import { Schema, model } from "mongoose";
import { IGuild } from "../types";
import { Prefix } from "../config/config.json";

const GuildSchema = new Schema<IGuild>({
    guildID: {required:true, type: String},
    options: {
        prefix: {type: String, default: Prefix}
    }
})

const GuildModel = model("guild", GuildSchema)

export default GuildModel