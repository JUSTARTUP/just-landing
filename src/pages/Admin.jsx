import { useState } from 'react'
import { DATA_PATH, REPO, bytesToBase64, loadData, putFile, textToBase64 } from '../lib/github.js'

const TOKEN_KEY = 'just-admin-token'

function readToken() {
  try { return localStorage.getItem(TOKEN_KEY) ?? '' } catch { return '' }
}

function saveToken(token) {
  try { localStorage.setItem(TOKEN_KEY, token) } catch { /* 저장 안 돼도 이번 세션은 동작 */ }
}

// 순서 변경/삭제/추가가 되는 리스트 (수상, 프로젝트, 연간 일정 공용)
function ListEditor({ items, onChange, blank, children }) {
  const move = (i, d) => {
    const next = [...items]
    ;[next[i], next[i + d]] = [next[i + d], next[i]]
    onChange(next)
  }
  const update = (i, patch) => onChange(items.map((it, j) => (j === i ? patch(it) : it)))

  return (
    <div className="admin-list">
      {items.map((item, i) => (
        <div key={i} className="admin-item">
          <span className="admin-index">{i + 1}</span>
          <div className="admin-fields">{children(item, (patch) => update(i, patch))}</div>
          <div className="admin-actions">
            <button type="button" disabled={i === 0} onClick={() => move(i, -1)}>↑</button>
            <button type="button" disabled={i === items.length - 1} onClick={() => move(i, 1)}>↓</button>
            <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))}>삭제</button>
          </div>
        </div>
      ))}
      <button type="button" className="admin-add" onClick={() => onChange([...items, blank])}>+ 추가</button>
    </div>
  )
}

function Field({ label, ...props }) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {props.rows ? <textarea {...props} /> : <input {...props} />}
    </label>
  )
}

export default function Admin() {
  const [token, setToken] = useState(readToken)
  const [data, setData] = useState(null)
  const [sha, setSha] = useState(null)
  const [previews, setPreviews] = useState({})
  const [status, setStatus] = useState('')
  const [busy, setBusy] = useState(false)

  const run = async (fn) => {
    setBusy(true)
    try { await fn() } catch (e) { setStatus(`❌ ${e.message}`) } finally { setBusy(false) }
  }

  const load = () => run(async () => {
    const res = await loadData(token)
    saveToken(token)
    setData(res.data)
    setSha(res.sha)
    setStatus('불러왔어요.')
  })

  const save = () => run(async () => {
    const json = JSON.stringify(data, null, 2) + '\n'
    setSha(await putFile(token, DATA_PATH, textToBase64(json), 'chore: 백오피스에서 사이트 데이터 수정', sha))
    setStatus('✅ 저장했어요. 1~2분 뒤 사이트에 반영돼요.')
  })

  const uploadImage = (file, setImage) => run(async () => {
    const name = `${Date.now()}-${file.name.replace(/[^\w.-]/g, '_')}`
    const path = `projects/${name}`
    const bytes = new Uint8Array(await file.arrayBuffer())
    await putFile(token, `public/${path}`, bytesToBase64(bytes), `chore: 프로젝트 이미지 업로드 (${file.name})`)
    setPreviews((p) => ({ ...p, [path]: URL.createObjectURL(file) }))
    setImage(path)
    setStatus('이미지를 올렸어요. 아래 저장 버튼을 눌러야 사이트에 반영돼요.')
  })

  const set = (key) => (value) => setData((d) => ({ ...d, [key]: value }))

  return (
    <main className="admin">
      <h1>JUST 백오피스</h1>
      <p className="admin-hint">
        <code>{REPO}</code>에 쓰기 권한이 있는 GitHub 토큰이 필요해요 (Fine-grained token → Contents: Read and write).
        토큰은 이 브라우저에만 저장돼요.
      </p>
      <div className="admin-token">
        <input type="password" placeholder="github_pat_..." value={token} onChange={(e) => setToken(e.target.value)} />
        <button type="button" disabled={!token || busy} onClick={load}>불러오기</button>
        <a href="#/">사이트로</a>
      </div>
      {status && <p className="admin-status">{status}</p>}

      {data && (
        <>
          <section>
            <h2>년도</h2>
            <Field label="올해 (메뉴·연간 일정·커리큘럼 제목에 쓰여요)" type="number" value={data.year}
              onChange={(e) => set('year')(Number(e.target.value))} />
          </section>

          <section>
            <h2>{data.year} 연간 일정</h2>
            <ListEditor items={data.yearSteps} onChange={set('yearSteps')} blank="">
              {(step, update) => (
                <Field label="내용 (줄바꿈 가능)" rows={2} value={step} onChange={(e) => update(() => e.target.value)} />
              )}
            </ListEditor>
          </section>

          <section>
            <h2>PRIZE ({data.prizes.length})</h2>
            <ListEditor items={data.prizes} onChange={set('prizes')} blank={{ title: '', award: '' }}>
              {(p, update) => (
                <>
                  <Field label="대회명" value={p.title} onChange={(e) => update((o) => ({ ...o, title: e.target.value }))} />
                  <Field label="수상 (굵게 표시)" value={p.award} onChange={(e) => update((o) => ({ ...o, award: e.target.value }))} />
                  <Field label="링크 (선택)" value={p.url ?? ''} onChange={(e) => update((o) => ({ ...o, url: e.target.value || undefined }))} />
                </>
              )}
            </ListEditor>
          </section>

          <section>
            <h2>PROJECT ({data.projects.length})</h2>
            <ListEditor items={data.projects} onChange={set('projects')} blank={{ image: '', subtitle: '', name: '' }}>
              {(p, update) => (
                <>
                  <div className="admin-thumb">
                    {p.image && <img src={previews[p.image] ?? p.image} alt="" />}
                    <label className="admin-field">
                      <span>이미지 (권장 비율 396:236)</span>
                      <input type="file" accept="image/*" disabled={busy}
                        onChange={(e) => e.target.files[0] && uploadImage(e.target.files[0], (image) => update((o) => ({ ...o, image })))} />
                    </label>
                  </div>
                  <Field label="한 줄 소개" value={p.subtitle} onChange={(e) => update((o) => ({ ...o, subtitle: e.target.value }))} />
                  <Field label="이름 (굵게 표시)" value={p.name} onChange={(e) => update((o) => ({ ...o, name: e.target.value }))} />
                  <Field label="링크 (선택)" value={p.url ?? ''} onChange={(e) => update((o) => ({ ...o, url: e.target.value || undefined }))} />
                </>
              )}
            </ListEditor>
          </section>

          <button type="button" className="admin-save" disabled={busy} onClick={save}>저장하고 배포하기</button>
        </>
      )}
    </main>
  )
}
