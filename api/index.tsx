/** @jsxImportSource frog/jsx */
import { Button, Frog } from 'frog'
import { handle } from 'frog/vercel'

// 👇👇👇 关键修复：强制开启 Edge Runtime 👇👇👇
// 这行代码会告诉 Vercel：“别用老旧的 Node 模式跑我，用最新的 Edge 模式！”
// Edge 模式天生支持 import 语法，彻底根治报错。
export const config = {
  runtime: 'edge',
}
// 👆👆👆 关键修复结束 👆👆👆

export const app = new Frog({
  basePath: '/api',
  title: 'Kobe Fans',
  // 这里可以放回你的 hub 配置，或者先留空测试
  // hub: neynar({ apiKey: process.env.NEYNAR_API_KEY }),
})

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
      // 功能1: 关注 Twitter (跳转链接)
      <Button.Link href="https://twitter.com/xc_kobe">关注 Twitter @xc_kobe</Button.Link>,
      // 功能2: 关注 Farcaster (跳转链接)
      <Button.Link href="https://warpcast.com/kobe2408">关注 Farcaster @kobe2408</Button.Link>,
      // 功能4: 加入群 (跳转链接)
      <Button.Link href="https://t.me/+f3CdHiJgXY43ZDk1">空投消息禁言粉丝群</Button.Link>,
      // 功能4: 进入签到页面
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

export const GET = handle(app)
export const POST = handle(app)