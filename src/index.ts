import { Client, Collection,} from "discord.js";
const client = new Client({intents:[7796]})
import { Command, SlashCommand } from "./types";
import { readdirSync } from "fs";
import { join } from "path";
import { Token } from "./config/config.json";

client.slashCommands = new Collection<string, SlashCommand>();
client.commands = new Collection<string, Command>();
client.cooldowns = new Collection<string, number>();

const handlersDir = join(__dirname, "./handlers");
readdirSync(handlersDir).forEach(handler => {
    require(`${handlersDir}/${handler}`)(client)
});
export default client;
client.login(Token);