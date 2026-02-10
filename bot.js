import { Client, GatewayIntentBits } from "discord.js";
import fetch from "node-fetch";
import cron from "node-cron";

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
    console.error("사이트 불러오기 실패:", err.message);
  }
}

client.once("ready", () => {
  console.log("봇이 온라인 상태입니다");

  // 시작할 때 1번 실행
  checkSite();

  // 30분마다 실행
  cron.schedule("*/30 * * * *", checkSite);
});

client.login(process.env.TOKEN);
