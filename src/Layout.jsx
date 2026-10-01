import { useEffect, useRef } from 'react'
import { useSite } from './lib/siteData.js'

const SECRET_CLICKS = 5

export default function Layout({ path, children }) {
  const site = useSite()
  const nav = [
    ['ABOUT.', '#/'],
    ['PORTFOLIO', '#/portfolio'],
    [String(site.year), `#/${site.year}`],
    ['Q&A', '#/qna'],
  ]

  // 푸터 로고를 연속 5번 클릭하면 백오피스로 이동 (1.5초 멈추면 초기화)
  const clicks = useRef({ count: 0, timer: 0 })
  const onLogoClick = () => {
    const c = clicks.current
    clearTimeout(c.timer)
    c.count += 1
    if (c.count >= SECRET_CLICKS) {
      c.count = 0
      location.hash = '#/admin'
      return
    }
    c.timer = setTimeout(() => (c.count = 0), 1500)
  }

  // .reveal 요소가 화면에 들어오면 아래→위로 등장.
  // 화면 아래로 완전히 빠지면(위로 스크롤해서 지나치면) 초기화 → 다시 내려올 때 또 재생
  useEffect(() => {
    const show = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) e.target.classList.add('is-visible')
    }, { rootMargin: '0px 0px -10% 0px' })
    const reset = new IntersectionObserver((entries) => {
      for (const e of entries) if (!e.isIntersecting && e.boundingClientRect.top > 0) e.target.classList.remove('is-visible')
    })
    document.querySelectorAll('.reveal').forEach((el) => {
      show.observe(el)
      reset.observe(el)
    })
    return () => {
      show.disconnect()
      reset.disconnect()
    }
  }, [path, site]) // 데이터가 실시간으로 바뀌어 새 요소가 생겨도 다시 관찰

  return (
    <>
      <header className="header">
        <a href="#/" className="header-logo">
          <img src="assets/logo.svg" width="102" height="40" alt="Just" />
        </a>
        <nav className="nav">
          {nav.map(([label, href]) => (
            <a key={href} href={href}>{label}</a>
          ))}
        </nav>
      </header>
      {/* key가 바뀌면 새로 마운트 → 페이지 진입 애니메이션 재생 (상단 바는 제외) */}
      <div key={path} className="page-enter">
        {children}
        <footer className="footer reveal">
          <img src="assets/footer-logo.svg" width="99" height="37.8" alt="Just" onClick={onLogoClick} />
          <div className="footer-sns">
            <a href="https://www.youtube.com/@Just_doit22/videos" target="_blank" rel="noreferrer" aria-label="YouTube">
              <img src="assets/youtube.svg" width="35.561" height="23.796" alt="" />
            </a>
            <a href="https://www.instagram.com/start_justup/" target="_blank" rel="noreferrer" aria-label="Instagram">
              <img src="assets/instagram.svg" width="29.6341" height="29.16" alt="" />
            </a>
          </div>
        </footer>
      </div>
    </>
  )
}
