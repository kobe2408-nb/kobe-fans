import { Button, Frog } from 'frog'
// import { neynar } from 'frog/hubs' // 暂时注释掉，如果没配置好Hub容易报错
import { handle } from 'frog/vercel' // 👈 关键：引入 Vercel 处理器

// 初始化 App
export const app = new Frog({
  title: 'Kobe Fans',
  basePath: '/api', // 👈 关键：设置基础路径，防止路径混乱
  // 如果你还没配好 NEYNAR_API_KEY，这一行先注释掉，用默认的免费额度测试
  // hub: neynar({ apiKey: process.env.NEYNAR_API_KEY || 'NEYNAR_API_DOCS' }),
})

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
      <Button.Link href="https://twitter.com/xc_kobe">关注小科比推特</Button.Link>,
      <Button.Link href="https://warpcast.com/kobe2408">关注小科比Farcaster</Button.Link>,
      <Button.Link href="https://t.me/+f3CdHiJgXY43ZDk1">空投消息禁言粉丝群</Button.Link>,
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

// 👇 关键：这才是 Vercel 能看懂的“通行证”
export const GET = handle(app)
export const POST = handle(app)