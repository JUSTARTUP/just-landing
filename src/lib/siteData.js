import { createContext, useContext, useEffect, useState } from 'react'
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from './firebase.js'
import fallback from '../data/site.json'

// Firestore 구조
//   site/main   { year, yearSteps, prizes: [{ title, award, url? }] }
//   projects/*  { order, image(data URL), subtitle, name, url? }  ← 이미지 크기 때문에 문서 분리 (문서당 1MB 제한)
export const mainDoc = () => doc(db, 'site', 'main')
export const projectsCol = () => collection(db, 'projects')

// 실시간 구독. Firebase 미설정·오류·아직 데이터 이전 전·응답 지연이면 번들된 site.json 사용 (live: false)
const WAIT_MS = 2000
export function useSiteData() {
  const [site, setSite] = useState(db ? null : fallback)

  useEffect(() => {
    if (!db) return
    let main, projects
    const emit = () => {
      if (main === undefined || projects === undefined) return
      setSite(main ? { ...main, projects, live: true } : fallback)
    }
    const onError = () => setSite(fallback)
    // 연결 실패 시 Firestore는 에러 없이 재시도만 해서, 기다리다 빈 화면이 되지 않도록 일정 시간 후 fallback
    const timer = setTimeout(() => setSite((s) => s ?? fallback), WAIT_MS)
    const unsubs = [
      onSnapshot(mainDoc(), (s) => { main = s.exists() ? s.data() : null; emit() }, onError),
      onSnapshot(query(projectsCol(), orderBy('order')), (s) => {
        projects = s.docs.map((d) => ({ id: d.id, ...d.data() }))
        emit()
      }, onError),
    ]
    return () => {
      clearTimeout(timer)
      unsubs.forEach((u) => u())
    }
  }, [])

  return site
}

export const FOUNDED = 2022 // 1기
export const generation = (year) => year - FOUNDED + 1

export const SiteContext = createContext(fallback)
export const useSite = () => useContext(SiteContext)
