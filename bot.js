const { Client, GatewayIntentBits } = require("discord.js");
const cron = require("node-cron");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

/* ================== 설정 ================== */
// 디스코드 채널 ID (숫자만)
const CHANNEL_ID = "1464170323091001415";

// 감시할 사이트 주소
const TARGET_URL =
  "https://www.aion2tool.com/region/%ED%8E%98%EB%A5%B4%EB%85%B8%EC%8A%A4/%EB%B0%B1%EC%95%BC";
// =========================================== */

let lastContentHash = null;

// 문자열을 간단히 비교하기 위한 해시 함수
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

async function checkSite() {
  try {
    const res = await fetch(TARGET_URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36"
      }
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const text = await res.text();
    const currentHash = simpleHash(text);

    // 첫 실행 시 기준만 저장
    if (lastContentHash === null) {
      lastContentHash = currentHash;
      console.log("초기 사이트 상태 저장 완료");
      return;
    }

    // 변경 감지
    if (lastContentHash !== currentHash) {
      const channel = await client.channels.fetch(CHANNEL_ID);
      await channel.send("사이트 내용이 변경되었습니다.");
      lastContentHash = currentHash;
      console.log("변경 감지 → 메시지 전송");
    } else {
      console.log("변경 없음");
    }
  } catch (err) {
    console.error("사이트 체크 실패:", err.message);
  }
}

client.once("ready", async () => {
  console.log("봇 온라인");

  // ▶ 봇 동작 확인용 테스트 메시지 (1회)
  try {
    const channel = await client.channels.fetch(CHANNEL_ID);
    await channel.send("봇 정상 기동 완료");
  } catch (e) {
    console.error("테스트 메시지 전송 실패:", e.message);
  }

  // 즉시 1회 체크
  await checkSite();

  // 30분마다 반복 체크
  cron.schedule("*/30 * * * *", checkSite);
});

// Railway 환경변수 TOKEN 사용
client.login(process.env.TOKEN);
