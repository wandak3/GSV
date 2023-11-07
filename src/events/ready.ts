import { BotEvent } from "../types";

const event: BotEvent = {
  name: "ready",
  once: true,
  execute: async (client): Promise<void> => {
    console.log("Logged in as " + client.user?.tag);
    console.log(`${client.user.tag} Is now logged in.`);
    console.table({
      guilds: client.guilds.cache.size,
      members: client.guilds.cache
        .map((c: any) => c.memberCount)
        .filter((v: any) => typeof v === "number")
        .reduce((a: any, b: any) => a + b, 0),
      ping: client.ws.ping,
    });
  },
};

export default event;
