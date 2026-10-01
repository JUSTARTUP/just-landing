import { useEffect, useRef, useState } from "react";
import { useSite } from "./lib/siteData.js";

const SECRET_CLICKS = 5;

export default function Layout({ path, children }) {
  const site = useSite();
  const nav = [
    ["ABOUT", "#/"],
    ["PORTFOLIO", "#/portfolio"],
    [String(site.year), `#/${site.year}`],
    ["Q&A", "#/qna"],
  ];

  // 모바일 햄버거 메뉴: 페이지 이동·바깥 터치·Esc로 닫힘
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef(null);
  useEffect(() => setMenuOpen(false), [path]);
  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e) =>
      !headerRef.current.contains(e.target) && setMenuOpen(false);
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    addEventListener("pointerdown", onDown);
    addEventListener("keydown", onKey);
    return () => {
      removeEventListener("pointerdown", onDown);
      removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  // 푸터 로고를 연속 5번 클릭하면 백오피스로 이동 (1.5초 멈추면 초기화)
  const clicks = useRef({ count: 0, timer: 0 });
  const onLogoClick = () => {
    const c = clicks.current;
    clearTimeout(c.timer);
    c.count += 1;
    if (c.count >= SECRET_CLICKS) {
      c.count = 0;
      location.hash = "#/admin";
      return;
    }
    c.timer = setTimeout(() => (c.count = 0), 1500);
  };

  // .reveal 요소가 화면에 들어오면 아래→위로 등장.
  // 화면 아래로 완전히 빠지면(위로 스크롤해서 지나치면) 초기화 → 다시 내려올 때 또 재생
  useEffect(() => {
    const show = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting) e.target.classList.add("is-visible");
      },
      { rootMargin: "0px 0px -10% 0px" }
    );
    const reset = new IntersectionObserver((entries) => {
      for (const e of entries)
        if (!e.isIntersecting && e.boundingClientRect.top > 0)
          e.target.classList.remove("is-visible");
    });
    document.querySelectorAll(".reveal").forEach((el) => {
      show.observe(el);
      reset.observe(el);
    });
    return () => {
      show.disconnect();
      reset.disconnect();
    };
  }, [path, site]); // 데이터가 실시간으로 바뀌어 새 요소가 생겨도 다시 관찰

  return (
    <>
      <header ref={headerRef} className="header">
        <a href="#/" className="header-logo">
          <img src="assets/logo.svg" width="102" height="40" alt="Just" />
        </a>
        <nav id="site-nav" className={`nav${menuOpen ? " is-open" : ""}`}>
          {nav.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          className="header-menu"
          aria-label="메뉴"
          aria-expanded={menuOpen}
          aria-controls="site-nav"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <img src="assets/menu.svg" width="30" height="30" alt="" />
        </button>
      </header>
      {/* key가 바뀌면 새로 마운트 → 페이지 진입 애니메이션 재생 (상단 바는 제외) */}
      <div key={path} className="page-enter">
        {children}
        {/* 등장 애니메이션 없음: 페이지 끝이라 화면 높이에 따라 등장 조건을 못 채워 안 보일 수 있음 */}
        <footer className="footer">
          <img
            src="assets/footer-logo.svg"
            width="99"
            height="37.8"
            alt="Just"
            onClick={onLogoClick}
          />
          <div className="footer-sns">
            <a
              href="https://www.youtube.com/@Just_doit22/videos"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
            >
              <img
                src="assets/youtube.svg"
                width="35.561"
                height="23.796"
                alt=""
              />
            </a>
            <a
              href="https://www.instagram.com/start_justup/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <img
                src="assets/instagram.svg"
                width="29.6341"
                height="29.16"
                alt=""
              />
            </a>
          </div>
        </footer>
      </div>
    </>
  );
}
