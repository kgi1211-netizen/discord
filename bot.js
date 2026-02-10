const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once("ready", () => {
  console.log("봇이 온라인 상태입니다");
});

client.login(process.env.TOKEN);
