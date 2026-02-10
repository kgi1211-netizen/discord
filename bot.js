const { Client, GatewayIntentBits } = require("discord.js");
const cron = require("node-cron");

const client = new Client({
  intents: [GatewayIntentBits.Guilds] // 서버 멤버 정보 등이 필요 없으면 Guilds만 있어도 됨
});

/* ================== 설정 ================== */
const CHANNEL_ID = "1464170323091001415"; // ★ 꼭 실제 채널 ID로 변경
const TARGET_URL = "https://www.aion2tool.com/region/%ED%8E%98%EB%A5%B4%EB%85%B8%EC%8A%A4/%EB%B0%B1%EC%95%BC";
/* =========================================== */

let lastContentHash = null;

// 간단한 해시 함수
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

async function checkSite() {
  console.log(`[${new Date().toLocaleTimeString()}] 사이트 체크 시작...`);
  
  try {
    const res = await fetch(TARGET_URL, {
      method: "GET",
      headers: {
        // ★ 헤더 보강: 실제 브라우저처럼 보이게 속임
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
        "Referer": "https://www.aion2tool.com/", // 리퍼러 추가 (중요)
        "Cache-Control": "no-cache"
      }
    });

    console.log(`응답 상태 코드: ${res.status}`); // 200이 아니면 차단된 것

    if (!res.ok) throw new Error(`HTTP 에러! 상태: ${res.status}`);

    const text = await res.text();
    
    // ★ 디버깅: 가져온 내용의 앞부분 200글자만 로그에 출력해봄 (제대로 가져왔는지
