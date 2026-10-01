import { initializeApp } from 'firebase/app'
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore'

// Firebase 콘솔 → 프로젝트 설정 → 내 앱(웹)의 설정값.
// 웹 설정값은 공개돼도 괜찮은 값이고, 실제 보안은 firestore.rules가 담당.
// 비어 있으면 Firebase 없이 src/data/site.json으로 동작.
const config = {
  apiKey: 'AIzaSyCqiHd1DokJRMvElXmY5sVj51NsdDy4CLc',
  projectId: 'just-landing-fe527',
  appId: '1:918114586498:web:20375e7bb83fbcd55b099b',
}

export const app = config.apiKey ? initializeApp(config) : null

// 로컬 캐시: 재방문 시 네트워크 기다리지 않고 바로 렌더
export const db = app
  ? initializeFirestore(app, { localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }) })
  : null
