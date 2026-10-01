import { useRef } from 'react'
import { FOUNDED, useSite } from '../lib/siteData.js'
import { scrollToElement } from '../lib/scroll.js'

const JUST_STACK = Array.from({ length: 16 }, (_, i) => `assets/just-${String(i + 1).padStart(2, '0')}.svg`)

const CHOICES = [
  {
    icon: 'assets/fire.png',
    label: '메인 프로젝트 참여',
    desc: <>충분한 준비가 되었다면,<br />바로 <b>창업 과정</b>을 경험</>,
  },
  {
    icon: 'assets/trophy.png',
    label: '대회 참가',
    desc: <>중요한 <b>경험</b>을 쌓고,<br />포트폴리오에 들어갈 <b>수상 실적</b> 마련</>,
  },
  {
    icon: 'assets/notebook.png',
    label: '역량 강화 스터디',
    desc: <>실력 강화를 위한<br /><b>추가 스터디</b></>,
  },
]

const MONTHS = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

const OPTIONAL = <small className="curriculum-opt">(선택)</small>

// 커리큘럼 바 위치: 1528px 폭 트랙 기준 % (Figma 좌표 197~1725)
// 1024px 미만은 세로 배치: 위 행은 오른쪽 열, 아래 행은 왼쪽 열. m = [top, height]px, mLabel = 줄바꿈 들어간 모바일 문구 (Figma 6:31)
const CURRICULUM = [
  [
    { left: 0, width: 33.12, label: '💪🏼 역량 강화교육', mLabel: '💪🏼 역량 강화 교육', m: [0, 176] },
    { left: 35.54, width: 64.46, label: '🏆 대회 참가 (선택)', mLabel: <>🏆 대회 참가{OPTIONAL}</>, m: [207, 462] },
  ],
  [
    { left: 0, width: 12.37, label: '🔥 공통교육', solid: true, m: [0, 48] },
    { left: 14.73, width: 32.46, label: '📚 역량 강화 스터디 (선택)', svg: true, mLabel: <>📚 역량 강화 스터디{OPTIONAL}</>, m: [69, 255] },
    {
      left: 49.61,
      width: 50.39,
      label: '📂 메인 프로젝트 참여 or 개인 프로젝트 진행 (선택)',
      mLabel: <>📂 메인 프로젝트 참여<small>또는</small>👤 개인 프로젝트 진행{OPTIONAL}</>,
      m: [345, 324],
    },
  ],
]

function ViewMore({ href }) {
  return (
    <a className="view-more" href={href}>
      View more
      <span className="view-more-arrow" />
    </a>
  )
}

export default function Home() {
  const site = useSite()
  const years = site.year - FOUNDED
  const storyRef = useRef(null)

  return (
    <main className="home">
      <section className="hero">
        <p className="hero-slogan reveal">
          Journey starts from here from you.<br />
          Use and develop your ability with us,<br />
          Solve problems to create value.<br />
          Travel will <span className="orange">JUST</span> begin now.
        </p>
        <button type="button" className="hero-scroll" onClick={() => scrollToElement(storyRef.current, 160)}>
          scroll down
        </button>
      </section>

      <section className="story" ref={storyRef}>
        <div className="story-stack">
          {JUST_STACK.map((src) => (
            <img key={src} src={src} width="343" height="132.438" alt="" />
          ))}
        </div>
        {/* 로고 묶음 바로 아래 (모바일에서 글들이 세로로 쌓여도 로고에 붙어 있게 섹션 안에 둠) */}
        <div className="journey-line" />

        <h2 className="story-tagline reveal">
          The<br />
          <span className="orange">Starting<br />Point</span><br />
          of<br />
          Your<br />
          <span className="orange">Journey</span>
        </h2>

        <p className="story-intro reveal">
          <b>창업</b><span className="gray">은</span> <b>하나의 여정</b><span className="gray">입니다.</span><br />
          <b>JUST</b><span className="gray">는 {FOUNDED}년에 여정을 시작해</span><br />
          <span className="gray">{years}년이라는 기간 동안</span><br />
          <b>65개의 목적지</b><span className="gray">에 도달하며</span><br />
          <span className="gray">다양한 문제를 해결하고 가치를 창출했습니다.</span>
        </p>

        <h2 className="story-years reveal">
          <span className="orange">JUST</span>의 {years}년
        </h2>

        <img className="story-folder reveal" src="assets/fav-folder.png" width="258" height="230" alt="" />
        <div className="story-projects reveal">
          <p>
            Just는 <b className="orange">{FOUNDED}년에</b> 개설되었지만<br />
            카로로, 엄랭, 이루, ZEPING, Abibo 등<br />
            <b className="orange">무려 65개</b>의 프로젝트를 이뤄냈어요.
          </p>
          <ViewMore href="#/portfolio" />
        </div>

        <img className="story-star reveal" src="assets/star.png" width="268" height="268" alt="" />
        <div className="story-prizes reveal">
          <p>
            Just는 많은 프로젝트 개수만큼<br />
            <b className="orange">상</b>도 많이 받았어요!<br />
            정말 단지, <b className="orange">Just</b> 했을 뿐인데!
          </p>
          <ViewMore href="#/portfolio" />
        </div>
      </section>

      <section className="choices">
        <h2 className="choices-title reveal">
          자, 이제 <span className="orange">여러분</span>이 <span className="orange">여정</span>을 떠날 시간입니다!
        </h2>
        <p className="choices-lead reveal">
          1학년 친구들은 4월까지 <b>역량 강화교육</b>을 진행해요.<br />
          프로젝트에 들어갈 준비를 마치고 나면 <b>세 가지 선택지</b> 중 선택하게 돼요.
        </p>
        <div className="choices-cards">
          {CHOICES.map((c, i) => (
            <div key={c.label} className="choice-card reveal" style={{ '--i': i }}>
              <img src={c.icon} width="108.9" height="108.9" alt="" />
              <span className="choice-pill">{c.label}</span>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="curriculum">
        <h2 className="curriculum-title reveal">
          {site.year} <span className="orange">Just</span> 커리큘럼
        </h2>
        <div className="curriculum-track">
          <div className="curriculum-months reveal">
            {MONTHS.map((m) => <span key={m}>{m}</span>)}
          </div>
          {CURRICULUM.map((row, i) => (
            <div key={i} className="curriculum-row reveal" style={{ '--i': i + 1 }}>
              {row.map((bar) => (
                <div
                  key={bar.label}
                  className={`curriculum-bar${bar.solid ? ' is-solid' : ''}${bar.svg ? ' is-svg' : ''}`}
                  style={{
                    left: `${bar.left}%`,
                    width: `${bar.width}%`,
                    backgroundImage: bar.svg && 'url(assets/curriculum-bar.svg)',
                    '--m-top': `${bar.m[0]}px`,
                    '--m-height': `${bar.m[1]}px`,
                  }}
                >
                  <span className="curriculum-label">{bar.label}</span>
                  <span className="curriculum-label-m">{bar.mLabel ?? bar.label}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
