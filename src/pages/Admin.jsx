import { useCallback, useEffect, useRef, useState } from 'react'
import { addDoc, deleteDoc, doc, getDoc, updateDoc, writeBatch } from 'firebase/firestore'
import { db } from '../lib/firebase.js'
import { mainDoc, projectsCol, useSite } from '../lib/siteData.js'
import fallback from '../data/site.json'

const IMAGE_WIDTH = 800 // 카드 표시 폭(최대 ~400px)의 2배
const MAX_PROJECTS = 4 // 포트폴리오 페이지 한 줄(4칸) 디자인 기준

// 이미지를 800px JPEG data URL로 줄여 Firestore 문서에 그대로 저장 (Storage는 유료 요금제 필요)
// ponytail: 문서당 1MB 제한이라 800px JPEG(~100KB)면 충분. 원본급 화질이 필요해지면 Storage로 이전
async function toDataUrl(blob) {
  const bitmap = await createImageBitmap(blob)
  const scale = Math.min(1, IMAGE_WIDTH / bitmap.width)
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/jpeg', 0.82)
}

function goBack() {
  if (history.length > 1) history.back()
  else location.hash = '#/'
}

// 네이티브 <dialog> 모달. 바깥(배경) 클릭·Esc로 닫힘
function Modal({ title, onClose, onSubmit, children }) {
  const ref = useRef(null)
  useEffect(() => ref.current.showModal(), [])

  return (
    <dialog ref={ref} className="admin-modal" onClose={onClose} onClick={(e) => e.target === ref.current && onClose()}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit(Object.fromEntries(new FormData(e.currentTarget)))
        }}
      >
        <h3>{title}</h3>
        {children}
        <div className="admin-modal-actions">
          <button type="button" onClick={onClose}>취소</button>
          <button type="submit" className="is-primary">저장</button>
        </div>
      </form>
    </dialog>
  )
}

function Field({ label, ...props }) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      <input {...props} />
    </label>
  )
}

function PrizeModal({ prize, onClose, onSave }) {
  return (
    <Modal
      title={prize ? 'PRIZE 수정' : 'PRIZE 추가'}
      onClose={onClose}
      onSubmit={({ title, award }) => onSave({ title: title.trim(), award: award.trim() })}
    >
      <Field label="대회명" name="title" required defaultValue={prize?.title} placeholder="예) 2025 시스코 이노베이션 챌린지" />
      <Field label="수상 (굵게 표시)" name="award" required defaultValue={prize?.award} placeholder="예) 대상" />
    </Modal>
  )
}

function ProjectModal({ project, onClose, onSave }) {
  const [image, setImage] = useState(project?.image ?? '')
  const [imageError, setImageError] = useState('')

  const pickImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    try {
      setImage(await toDataUrl(file))
      setImageError('')
    } catch {
      // Chrome 등은 HEIC(아이폰 사진 기본 형식)를 못 읽음
      setImageError('이 사진 형식은 열 수 없어요. JPG나 PNG로 올려주세요. (아이폰 사진은 HEIC라서 변환이 필요해요)')
      e.target.value = ''
    }
  }

  return (
    <Modal
      title={project ? 'PROJECT 수정' : 'PROJECT 추가'}
      onClose={onClose}
      onSubmit={({ subtitle, name, url }) => onSave({ image, subtitle: subtitle.trim(), name: name.trim(), url: url || null })}
    >
      <label className="admin-field">
        <span>이미지 (가로 396 : 세로 236 비율 권장)</span>
        {image && <img className="admin-preview" src={image} alt="" />}
        <input
          type="file"
          accept="image/*"
          required={!image}
          onChange={pickImage}
        />
        {imageError && <span className="admin-error">{imageError}</span>}
      </label>
      <Field label="한 줄 소개" name="subtitle" required defaultValue={project?.subtitle} placeholder="예) 로그인 정보 저장 서비스" />
      <Field label="이름 (굵게 표시)" name="name" required defaultValue={project?.name} placeholder="예) Abibo" />
      <Field label="링크 (선택)" name="url" type="url" defaultValue={project?.url ?? ''} placeholder="https://" />
    </Modal>
  )
}

// 화면 아래 토스트. onConfirm이 있으면 취소/삭제 버튼을 달고 누를 때까지 유지 (브라우저 confirm 대체)
function Toast({ toast, onClose }) {
  useEffect(() => {
    if (toast.onConfirm) return
    const timer = setTimeout(onClose, 2500)
    return () => clearTimeout(timer)
  }, [toast, onClose])

  return (
    <div className="admin-toast" role="status">
      {toast.text}
      {toast.onConfirm && (
        <span className="admin-toast-actions">
          <button type="button" onClick={onClose}>취소</button>
          <button
            type="button"
            className="is-danger"
            onClick={() => {
              onClose()
              toast.onConfirm()
            }}
          >
            삭제
          </button>
        </span>
      )}
    </div>
  )
}

function Editor({ site, run, toast, ask }) {
  const [year, setYear] = useState(site.year)
  const yearValid = /^\d{4}$/.test(year)
  const [editing, setEditing] = useState(null) // { kind: 'prize' | 'project', index: number | null }

  const addProject = () =>
    site.projects.length >= MAX_PROJECTS
      ? toast(`PROJECT는 최대 ${MAX_PROJECTS}개까지 올릴 수 있어요. 기존 항목을 삭제한 뒤 추가해주세요.`)
      : setEditing({ kind: 'project', index: null })

  useEffect(() => setYear(site.year), [site.year])

  const savePrize = (prize) => {
    const prizes = editing.index === null
      ? [prize, ...site.prizes]
      : site.prizes.map((p, i) => (i === editing.index ? prize : p))
    setEditing(null)
    run(() => updateDoc(mainDoc(), { prizes }), 'PRIZE를 저장했어요.')
  }

  const saveProject = (project) => {
    const target = editing.index === null ? null : site.projects[editing.index]
    setEditing(null)
    run(async () => {
      if (target) return updateDoc(doc(projectsCol(), target.id), project)
      // 새 프로젝트는 맨 앞에 오도록 가장 작은 order - 1
      const order = Math.min(0, ...site.projects.map((p) => p.order)) - 1
      return addDoc(projectsCol(), { ...project, order })
    }, 'PROJECT를 저장했어요.')
  }

  return (
    <>
      <section className="admin-section">
        <h2>년도</h2>
        <form
          className="admin-year"
          onSubmit={(e) => {
            e.preventDefault()
            run(() => updateDoc(mainDoc(), { year: Number(year) }), '년도를 저장했어요.')
          }}
        >
          <Field
            label="현재 년도 혹은 모집할 년도를 입력해주세요"
            inputMode="numeric"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
          <button type="submit" className="is-primary" disabled={!yearValid || Number(year) === site.year}>저장</button>
        </form>
        <p className="admin-hint">메뉴, 연간 일정 페이지, 홈 커리큘럼 제목, "JUST의 N년"에 쓰여요.</p>
        {!yearValid && <p className="admin-error">4자리 숫자로 입력해주세요. (예: 2026)</p>}
      </section>

      <section className="admin-section">
        <div className="admin-section-head">
          <h2>PRIZE <span>{site.prizes.length}</span></h2>
          <button type="button" className="is-primary" onClick={() => setEditing({ kind: 'prize', index: null })}>+ 추가</button>
        </div>
        <ul className="admin-prizes">
          {site.prizes.map((p, i) => (
            <li key={`${p.title}-${p.award}-${i}`}>
              <button type="button" className="admin-row" onClick={() => setEditing({ kind: 'prize', index: i })}>
                🏆 {p.title} <b>{p.award}</b>
              </button>
              <button
                type="button"
                className="admin-delete"
                onClick={() =>
                  ask(`"${p.title} ${p.award}"을(를) 삭제할까요?`, () =>
                    run(() => updateDoc(mainDoc(), { prizes: site.prizes.filter((_, j) => j !== i) }), '삭제했어요.'),
                  )
                }
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="admin-section">
        <div className="admin-section-head">
          <h2>PROJECT <span>{site.projects.length}</span></h2>
          <button type="button" className="is-primary" onClick={addProject}>+ 추가</button>
        </div>
        <ul className="admin-projects">
          {site.projects.map((p, i) => (
            <li key={p.id}>
              <button type="button" className="admin-card" onClick={() => setEditing({ kind: 'project', index: i })}>
                <img src={p.image} alt="" />
                <span>{p.subtitle}<br /><b>{p.name}</b></span>
              </button>
              <button
                type="button"
                className="admin-delete"
                onClick={() => ask(`"${p.name}"을(를) 삭제할까요?`, () => run(() => deleteDoc(doc(projectsCol(), p.id)), '삭제했어요.'))}
              >
                삭제
              </button>
            </li>
          ))}
        </ul>
      </section>

      {editing?.kind === 'prize' && (
        <PrizeModal prize={site.prizes[editing.index]} onClose={() => setEditing(null)} onSave={savePrize} />
      )}
      {editing?.kind === 'project' && (
        <ProjectModal project={site.projects[editing.index]} onClose={() => setEditing(null)} onSave={saveProject} />
      )}
    </>
  )
}

// 최초 1회: 번들된 site.json(기존 데이터)을 Firestore로 옮김
async function importFallback() {
  // 응답 지연으로 이 화면이 떴을 수 있으니, 이미 데이터가 있으면 덮어쓰지 않음
  if ((await getDoc(mainDoc())).exists()) throw new Error('이미 Firebase에 데이터가 있어요. 새로고침해 주세요.')
  const batch = writeBatch(db)
  batch.set(mainDoc(), { year: fallback.year, yearSteps: fallback.yearSteps, prizes: fallback.prizes })
  for (const [order, p] of fallback.projects.entries()) {
    const image = await toDataUrl(await (await fetch(p.image)).blob())
    batch.set(doc(projectsCol()), { ...p, image, order })
  }
  await batch.commit()
}

export default function Admin() {
  const site = useSite()
  const [toast, setToast] = useState(null) // { id, text, onConfirm? } — id가 바뀌면 타이머·애니메이션 재시작
  const show = (text, extra) => setToast({ id: Date.now(), text, ...extra })
  const hide = useCallback(() => setToast(null), [])
  const ask = (text, onConfirm) => show(text, { onConfirm })

  const run = async (fn, done) => {
    try {
      await fn()
      show(done)
    } catch (e) {
      show(e.message)
    }
  }

  let body
  if (!db) body = <p className="admin-hint">Firebase 설정이 필요해요. <code>src/lib/firebase.js</code>에 웹 앱 설정값을 넣어주세요.</p>
  else if (!site.live) {
    body = (
      <section className="admin-section">
        <p className="admin-hint">Firebase에 아직 데이터가 없어요. 지금 사이트에 있는 수상 {fallback.prizes.length}개, 프로젝트 {fallback.projects.length}개를 옮길까요?</p>
        <button type="button" className="is-primary" onClick={() => run(importFallback, '기존 데이터를 옮겼어요.')}>기존 데이터 가져오기</button>
      </section>
    )
  } else body = <Editor site={site} run={run} toast={show} ask={ask} />

  return (
    <main className="admin">
      <header className="admin-header">
        <button type="button" className="admin-back" onClick={goBack}>← 뒤로가기</button>
      </header>
      <h1>JUST 백오피스</h1>
      {body}
      {toast && <Toast key={toast.id} toast={toast} onClose={hide} />}
    </main>
  )
}
