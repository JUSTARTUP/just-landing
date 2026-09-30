import { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import site from './data/site.json'
import Layout from './Layout.jsx'
import Home from './pages/Home.jsx'
import Portfolio from './pages/Portfolio.jsx'
import Year from './pages/Year.jsx'
import Qna from './pages/Qna.jsx'
import Admin from './pages/Admin.jsx'
import { scrollToTop } from './lib/scroll.js'
import './index.css'

// 1920 기준 디자인을 화면 폭에 맞춰 통째로 축소 (1024px 미만은 모바일 레이아웃).
// 전체가 여전히 크면 DESIGN_WIDTH를 키우면 됨 (예: 2200 → 1920 화면에서도 87%)
const DESIGN_WIDTH = 1920
function fitToScreen() {
  const scale = innerWidth >= 1024 && location.hash !== '#/admin' ? Math.min(1, innerWidth / DESIGN_WIDTH) : 1
  document.documentElement.style.zoom = scale === 1 ? '' : scale
  // 축소된 좌표계 기준 실제 화면 높이 (vh는 zoom과 섞이면 부정확)
  document.documentElement.style.setProperty('--screen-h', `${innerHeight / scale}px`)
}
fitToScreen()
addEventListener('resize', fitToScreen)
addEventListener('hashchange', fitToScreen)

// 해시 라우팅: GitHub Pages는 SPA 경로 폴백이 없어서 #/path 사용
const routes = {
  '/': Home,
  '/portfolio': Portfolio,
  [`/${site.year}`]: Year,
  '/qna': Qna,
}

function App() {
  const [path, setPath] = useState(location.hash.slice(1) || '/')

  useEffect(() => {
    const onChange = () => {
      setPath(location.hash.slice(1) || '/')
      scrollToTop()
    }
    addEventListener('hashchange', onChange)
    return () => removeEventListener('hashchange', onChange)
  }, [])

  if (path === '/admin') return <Admin />
  const Page = routes[path] ?? Home
  return (
    <Layout path={path}>
      <Page />
    </Layout>
  )
}

createRoot(document.getElementById('root')).render(<App />)
