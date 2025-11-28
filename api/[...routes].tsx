/** @jsxImportSource frog/jsx */
import { Button, Frog } from 'frog'
import { devtools } from 'frog/dev'

// ✅ 1. 强制 Edge 模式 (解决 SyntaxError)
export const config = {
  runtime: 'edge',
}

// ✅ 2. 基础路径设为 /api
export const app = new Frog({
  basePath: '/api',
  title: 'Kobe Fans',
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

devtools(app, { assetsPath: '/.frog' })

// ✅ 3. 直接导出 fetch
export const GET = app.fetch
export const POST = app.fetch