import { Button, Frog } from 'frog'
import { devtools } from 'frog/dev'
import { neynar } from 'frog/hubs'
import { serveStatic } from 'frog/serve-static'

// 1. 初始化 Frog App，使用 Neynar 作为数据中心
export const app = new Frog({
  title: 'Kobe Fans',
  // 这里你需要把你的 NEYNAR_API_KEY 配置在环境变量里，后面会教你
  hub: neynar({ apiKey: process.env.NEYNAR_API_KEY || 'NEYNAR_API_DOCS' }),
})

// 模拟一个简单的内存数据库 (注意：重启后数据会丢失，正式上线建议用 Redis 或 Supabase)
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
  const { frameData, verified } = c
  // 获取用户的 FID (Farcaster ID)
  const fid = frameData?.fid || 0
  
  // 获取今天的日期字符串 (例如 2023-10-27)
  const today = new Date().toISOString().split('T')[0]
  
  // 从模拟数据库获取用户数据
  let userData = db.get(fid) || { points: 0, lastCheckIn: '' }
  let message = ''
  
  if (userData.lastCheckIn === today) {
    message = `你今天已经签到过了！当前积分: ${userData.points}`
  } else {
    // 积分递增逻辑：每次签到 +10 分 (你可以修改这里)
    userData.points += 10
    userData.lastCheckIn = today
    db.set(fid, userData)
    message = `✅ 签到成功！积分 +10。当前总分: ${userData.points}`
  }

  return c.res({
    image: (
      <div style={{ color: 'white', display: 'flex', fontSize: 40, backgroundColor: '#4c44e6', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center', padding: 40 }}>
        {message}
        <div style={{ fontSize: 20, marginTop: 20 }}>
           (模拟数据: Base 链上交互需连接钱包)
        </div>
      </div>
    ),
    intents: [
      <Button.Reset>返回主页</Button.Reset>
    ],
  })
})

devtools(app, { serveStatic })

if (typeof Bun !== 'undefined') {
  Bun.serve({
    fetch: app.fetch,
    port: 3000,
  })
  console.log('Server is running on port 3000')
}