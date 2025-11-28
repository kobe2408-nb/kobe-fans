/** @jsxImportSource frog/jsx */
import { Button, Frog } from 'frog'
import { devtools } from 'frog/dev' // 👈 加回调试工具
// import { handle } from 'frog/vercel' // 暂时不用 handle

// 保持 Edge 模式，这个目前是不报错的
export const config = {
  runtime: 'edge',
}

export const app = new Frog({
  basePath: '/api', // 👈 改回 /api
  title: 'Kobe Fans',
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

// 开启调试后台
devtools(app, { assetsPath: '/.frog' })

export const GET = app.fetch
export const POST = app.fetch