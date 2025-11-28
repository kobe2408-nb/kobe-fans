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
// 2. 主页 (Mini App 前端页面)
// -------------------------------------------------------------------------
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
        
        * {
          box-sizing: border-box;
        }

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
          margin-bottom: 20px;
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

        /* 统一容器 */
        .main-container {
          width: 90%;
          max-width: 400px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* 卡片样式修改开始 */
        .card {
          width: 100%;
          /* background: #111; Remove solid background */
          background-color: #0a0a0a; /* 给一个极深的底色作为衬托 */
          border: 1px solid #333;
          border-radius: 16px;
          padding: 20px;
          text-align: center;
          box-shadow: 0 4px 15px rgba(253, 185, 39, 0.1);
          
          /* 👇 关键：为伪元素定位做准备 👇 */
          position: relative;
          overflow: hidden; /* 确保背景图不溢出圆角 */
        }

        /* 👇 新增：伪元素用于放置半透明背景图 👇 */
        .card::before {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background-image: url('https://kobe-fans.vercel.app/image.png');
          background-size: cover; /* 铺满 */
          background-position: center; /* 居中 */
          opacity: 0.3; /* 30% 透明度 */
          z-index: 0; /* 放在最底层 */
          filter: grayscale(50%); /* 可选：稍微加点灰度让文字更突出，不需要可以删掉这行 */
        }

        /* 👇 关键：确保卡片里的文字内容浮在背景图上面 👇 */
        .card > * {
          position: relative;
          z-index: 1;
        }
        /* 卡片样式修改结束 */

        .score-box {
          font-size: 48px;
          font-weight: bold;
          color: #fff;
          margin: 10px 0;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5); /* 加点文字阴影增加可读性 */