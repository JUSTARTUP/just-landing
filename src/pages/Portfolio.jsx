import { useSite } from '../lib/siteData.js'

const PER_ROW = 3

function Prize({ title, award }) {
  return <div className="prize">🏆 {title} <b>{award}</b></div>
}

export default function Portfolio() {
  const site = useSite()
  const rows = []
  for (let i = 0; i < site.prizes.length; i += PER_ROW) rows.push(site.prizes.slice(i, i + PER_ROW))

  return (
    <main className="page">
      <h1 className="page-title">
        PRIZE
        <img src="assets/flag.png" width="83" height="83" alt="" />
      </h1>
      <div className="prizes">
        {rows.map((row, i) => (
          <div key={i} className="prize-row">
            {row.map((p, j) => <Prize key={j} {...p} />)}
          </div>
        ))}
      </div>

      <h1 className="page-title projects-title reveal">
        PROJECT
        <img src="assets/bulb.png" width="83" height="83" alt="" />
      </h1>
      <div className="projects">
        {site.projects.map((p, i) => {
          const card = (
            <>
              <div className="project-thumb">
                <img src={p.image} alt={p.name} />
              </div>
              <p className="project-text">
                {p.subtitle}<br /><b>{p.name}</b>
              </p>
            </>
          )
          return p.url
            ? <a key={p.id ?? p.name} className="project reveal" style={{ '--i': i % 4 }} href={p.url} target="_blank" rel="noreferrer">{card}</a>
            : <div key={p.id ?? p.name} className="project reveal" style={{ '--i': i % 4 }}>{card}</div>
        })}
      </div>
    </main>
  )
}
