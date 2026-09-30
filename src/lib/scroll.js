import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

// 관성 스크롤 (모션 줄이기 설정한 사용자는 기본 스크롤 유지)
const lenis = matchMedia('(prefers-reduced-motion: reduce)').matches ? null : new Lenis({ autoRaf: true })

export function scrollToTop() {
  lenis ? lenis.scrollTo(0, { immediate: true }) : window.scrollTo(0, 0)
}

// 고정 상단 바에 가리지 않게 그 높이만큼 덜 내려감. extra: 요소 시작점보다 더 내려갈 거리 (디자인 px)
export function scrollToElement(el, extra = 0) {
  const zoom = Number(document.documentElement.style.zoom) || 1
  const offset = extra * zoom - document.querySelector('.header').getBoundingClientRect().height
  if (lenis) lenis.scrollTo(el, { offset, duration: 1.2 })
  else window.scrollTo({ top: el.getBoundingClientRect().top + scrollY + offset, behavior: 'smooth' })
}
