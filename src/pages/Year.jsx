import site from '../data/site.json'

// 지그재그 타임라인: 짝수 행은 왼→오, 홀수 행은 오→왼으로 이어짐
export default function Year() {
  const steps = site.yearSteps
  const n = steps.length

  return (
    <main className="page">
      <h1 className="page-title year-title reveal">
        {site.year}
        <span className="year-key">
          <img src="assets/key.png" width="100" height="100" alt="" />
        </span>
      </h1>
      <ol className="timeline">
        {steps.map((text, i) => {
          const row = Math.floor(i / 2)
          const pos = i % 2
          const col = row % 2 === 0 ? pos + 1 : 2 - pos
          const hasRight = col === 1 && 2 * row + 1 < n
          const hasDown = pos === 1 && i + 1 < n
          return (
            <li key={i} className="timeline-step reveal" style={{ gridRow: row + 1, gridColumn: col, '--i': col - 1 }}>
              {text}
              {hasRight && <img className="timeline-h" src="assets/line-h.svg" width="120" height="4" alt="" />}
              {hasDown && (
                <span className="timeline-v">
                  <img src="assets/line-v.svg" width="60" height="3" alt="" />
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </main>
  )
}
