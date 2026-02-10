const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once("ready", async () => {
  console.log("봇이 온라인 상태입니다");

  try {
    const channel = await client.channels.fetch("여기에_채널ID");
    await channel.send("봇이 정상적으로 실행되었습니다");
  } catch (err) {
    console.error("메시지 전송 실패:", err);
  }
});

client.login(process.env.TOKEN);
