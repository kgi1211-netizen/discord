const { Client, GatewayIntentBits } = require("discord.js");
const cron = require("node-cron");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

/* ===== 여기만 수정 ===== */
const CHANNEL_ID = "1464170323091001415";
/* ====================== */

const TARGET_URL =
  "https://www.aion2tool.com/region/%ED%8E%98%EB%A5%B4%EB%85%B8%EC%8A%A4/%EB%B0%B1%EC%95%BC";

let lastContent = null;

async function checkSite() {
  try {
    const res = await fetch(TARGET_URL);
    const text = await res.text();

    if (lastContent && lastContent !== text) {
      const channel = await client.channels.fetch(CHANNEL_ID);
      await channel.send("사이트 내용이 변경되었습니다.");
    }

    lastContent = text;
    console.log("사이트 체크 완료");
  } catch (err) {
    console.error("사이트 체크 실패:", err.message);
  }
}

client.once("ready", async () => {
  console.log("봇 온라인");

  // 🔹 테스트 메시지 (한 번만 전송)
  try {
    const channel = await client.channels.fetch(CHANNEL_ID);
    await channel.send("봇 테스트 메시지: 정상 동작 중");
  } catch (e) {
    console.error("테스트 메시지 전송 실패:", e.message);
  }

  checkSite();
  cron.schedule("*/30 * * * *", checkSite);
});

client.login(process.env.TOKEN);

