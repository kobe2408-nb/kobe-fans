/** @jsxImportSource frog/jsx */
import { Button, Frog } from 'frog'

// ✅ 1. 保持 Edge 模式
export const config = {
  runtime: 'edge',
}

// ✅ 2. 基础路径设为 /
export const app = new Frog({
  basePath: '/', 
  title: 'Kobe Fans',
})

// 👇👇👇 关键：这里配置了你的 Manifest 身份证 👇👇👇
app.hono.get('/.well-known/farcaster.json', (c) => {
  return c.json({
    "frame": {
      "name": "kobe-fans",
      "version": "1",
      "iconUrl": "https://kobe-fans.vercel.app/icon.png",
      "homeUrl": "https://kobe-fans.vercel.app",
      "imageUrl": "https://kobe-fans.vercel.app/image.png",
      "splashImageUrl": "https://kobe-fans.vercel.app/splash.png",
      "splashBackgroundColor": "#8A2BE2",
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
// 👆👆👆 配置结束 👆👆👆

// 模拟数据库
const db = new Map<number, { points: number, lastCheckIn: string }>();

app.frame('/', (c) => {
  return c.res({
    image: (
      <div style={{ color: 'white', display: 'flex', fontSize: 60, backgroundColor: 'black', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        For Kobe Bryant Forever 🐍
        <div style={{ fontSize: 30, marginTop: 30 }}>Mamba Mentality</div>
      </div>
    ),
    intents: [
      <Button.Link href="https://twitter.com/xc_kobe">推特 @xc_kobe</Button.Link>,
      <Button.Link href="https://warpcast.com/kobe2408">Farcaster</Button.Link>,
      <Button.Link href="https://t.me/+f3CdHiJgXY43ZDk1">粉丝群</Button.Link>,
      <Button action="/check-in">Base 链上签到</Button>,
    ],
  })
})

app.frame('/check-in', (c) => {
  const { frameData } = c
  const fid = frameData?.fid || 0
  const today = new Date().toISOString().split('T')[0]
  
  let userData = db.get(fid) || { points: 0, lastCheckIn: '' }
  let message = ''
  
  if (userData.lastCheckIn === today) {
    message = `今天已签到！当前积分: ${userData.points}`
  } else {
    userData.points += 10
    userData.lastCheckIn = today
    db.set(fid, userData)
    message = `✅ 签到成功！积分 +10。总分: ${userData.points}`
  }

  return c.res({
    image: (
      <div style={{ color: 'white', display: 'flex', fontSize: 40, backgroundColor: '#4c44e6', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center', padding: 40 }}>
        {message}
      </div>
    ),
    intents: [
      <Button.Reset>返回主页</Button.Reset>
    ],
  })
})

export const GET = app.fetch
export const POST = app.fetch