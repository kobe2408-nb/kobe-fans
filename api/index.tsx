/** @jsxImportSource frog/jsx */
import { Frog } from 'frog'

// ✅ 1. 强制 Edge 模式
export const config = {
  runtime: 'edge',
}

// ✅ 2. 基础路径设为 /
export const app = new Frog({
  basePath: '/',
  title: 'Kobe Fans',
})

// -------------------------------------------------------------------------
// 1. 配置 Manifest (身份证)
// -------------------------------------------------------------------------
app.hono.get('/.well-known/farcaster.json', (c) => {
  return c.json({
    "frame": {
      "version": "1",
      "name": "Kobe Fans",
      "iconUrl": "https://kobe-fans.vercel.app/icon.png",
      "homeUrl": "https://kobe-fans.vercel.app",
      "imageUrl": "https://kobe-fans.vercel.app/image.png",
      "splashImageUrl": "https://kobe-fans.vercel.app/splash.png",
      "splashBackgroundColor": "#000000",
      "webhookUrl": "https://kobe-fans.vercel.app/api/webhook",
      "subtitle": "fans",
      "description": "all kobe fans",
      "primaryCategory": "entertainment"
    },
    "accountAssociation": {
      "header": "eyJmaWQiOjIxNDgwLCJ0eXBlIjoiYXV0aCIsImtleSI6IjB4ODcxN2ZDMEY2ZjllNjdkMzhmQTc1NzFjNTUwMWRmNzA3QTIzQzFBNiJ9",
      "payload": "eyJkb21haW4iOiJrb2JlLWZhbnMudmVyY2VsLmFwcCJ9",
      "signature": "lfmHILGn3ypB75mHZEFJOt5PksFCQ5BJGH1J1bZ0sNozFvNdd7bebnLClkAnKdCbKlZJZ6065y8vmA2mRIdF8Rs="
    }
  })
})

// -------------------------------------------------------------------------
// 2. 主页 (Mini App 前端页面 + Frame Meta)
// -------------------------------------------------------------------------
// 👇👇👇 修正：使用 app.hono.get 而不是 app.route 👇👇👇
app.hono.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="zh">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Kobe Fans Mini App</title>
      
      <meta property="fc:frame" content="vNext" />
      <meta property="fc:frame:image" content="https://kobe-fans.vercel.app/image.png" />
      <meta property="fc:frame:button:1" content="打开小程序" />
      <meta property="fc:frame:button:1:action" content="link" />
      <meta property="fc:frame:button:1:target" content="https://kobe-fans.vercel.app" />

      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
        
        body {
          margin: 0;
          padding: 0;
          background-color: #000000;
          color: #ffffff;
          font-family: 'Inter', sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 100vh;
        }

        .header {
          width: 100%;
          padding: 20px;
          text-align: center;
          background: linear-gradient(180deg, #1a1a1a 0%, #000000 100%);
          border-bottom: 2px solid #FDB927;
        }

        .title {
          font-size: 24px;
          font-weight: bold;
          color: #FDB927;
          margin-bottom: 5px;
        }

        .subtitle {
          font-size: 14px;
          color: #552583;
          font-weight: bold;
        }

        .card {
          background: #111;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 20px;
          margin: 20px;
          width: 90%;
          max-width: 400px;
          text-align: center;
          box-shadow: 0 4px 15px rgba(253, 185, 39, 0.1);
        }

        .score-box {
          font-size: 48px;
          font-weight: bold;
          color: #fff;
          margin: 10px 0;
        }

        .score-label {
          color: #888;
          font-size: 14px;
        }

        .btn-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
          max-width: 400px;
          padding: 0 20px;
        }

        .btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 16px;
          border-radius: 12px;
          font-weight: bold;
          font-size: 16px;
          cursor: pointer;
          text-decoration: none;
          transition: transform 0.1s;
          border: none;
        }

        .btn:active {
          transform: scale(0.98);
        }

        .btn-twitter { background-color: #1DA1F2; color: white; }
        .btn-farcaster { background-color: #855DCD; color: white; }
        .btn-telegram { background-color: #0088cc; color: white; }
        .btn-checkin { 
          background: linear-gradient(90deg, #552583 0%, #FDB927 100%); 
          color: white;
          font-size: 18px;
        }
        .btn-disabled {
          background: #333;
          color: #888;
          cursor: not-allowed;
        }

        .log {
          margin-top: 20px;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">KOBE FANS</div>
        <div class="subtitle">Mamba Mentality Forever</div>
      </div>

      <div class="card">
        <div class="score-label">当前积分 (Points)</div>
        <div class="score-box" id="score">0</div>
        <div style="color: #666; font-size: 12px;">每日签到 +10 分</div>
      </div>

      <div class="btn-group">
        <button class="btn btn-checkin" id="btn-checkin" onclick="handleCheckIn()">
          🏀 Base 链上签到
        </button>

        <a href="https://twitter.com/xc_kobe" target="_blank" class="btn btn-twitter">
          关注 Twitter @xc_kobe
        </a>

        <a href="https://warpcast.com/kobe2408" target="_blank" class="btn btn-farcaster">
          关注 Farcaster @kobe2408
        </a>

        <a href="https://t.me/+f3CdHiJgXY43ZDk1" target="_blank" class="btn btn-telegram">
          加入电报粉丝群
        </a>
      </div>

      <div class="log" id="log-area">Loading...</div>

      <script type="module">
        import sdk from 'https://esm.sh/@farcaster/frame-sdk@0.0.18';

        async function init() {
          const logArea = document.getElementById('log-area');
          
          try {
            await sdk.actions.ready();
            logArea.innerText = "Mini App Loaded Successfully ✅";
            loadUserData();
          } catch (e) {
            logArea.innerText = "Error: " + e.message;
            loadUserData();
          }
        }

        init();

        window.handleCheckIn = function() {
          const today = new Date().toISOString().split('T')[0];
          const lastCheckIn = localStorage.getItem('lastCheckIn');
          let points = parseInt(localStorage.getItem('points') || '0');

          if (lastCheckIn === today) {
            alert('今天已经签到过了！明天再来吧。');
            return;
          }

          points += 10;
          localStorage.setItem('points', points);
          localStorage.setItem('lastCheckIn', today);

          updateUI(points, true);
          alert('✅ 签到成功！积分 +10');
        }

        function loadUserData() {
          const points = localStorage.getItem('points') || '0';
          const lastCheckIn = localStorage.getItem('lastCheckIn');
          const today = new Date().toISOString().split('T')[0];
          
          const isCheckedIn = (lastCheckIn === today);
          updateUI(points, isCheckedIn);
        }

        function updateUI(points, isCheckedIn) {
          document.getElementById('score').innerText = points;
          const btn = document.getElementById('btn-checkin');
          
          if (isCheckedIn) {
            btn.innerText = "✅ 今日已签到";
            btn.classList.add('btn-disabled');
          } else {
            btn.innerText = "🏀 Base 链上签到";
            btn.classList.remove('btn-disabled');
          }
        }
      </script>
    </body>
    </html>
  `)
})

export const GET = app.fetch
export const POST = app.fetch