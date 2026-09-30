// 백오피스 저장소: GitHub Contents API로 레포 파일을 직접 커밋 → Actions가 재배포
export const REPO = 'JUSTARTUP/just-landing'
export const BRANCH = 'main'
export const DATA_PATH = 'src/data/site.json'

const API = `https://api.github.com/repos/${REPO}/contents/`

export function bytesToBase64(bytes) {
  let s = ''
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
  return btoa(s)
}

export const textToBase64 = (text) => bytesToBase64(new TextEncoder().encode(text))

export const base64ToText = (b64) =>
  new TextDecoder().decode(Uint8Array.from(atob(b64.replace(/\s/g, '')), (c) => c.charCodeAt(0)))

async function request(token, path, init) {
  const url = API + path + (init ? '' : `?ref=${BRANCH}`)
  const res = await fetch(url, {
    ...init,
    cache: 'no-store',
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' },
  })
  if (!res.ok) {
    const { message } = await res.json().catch(() => ({}))
    throw new Error(`GitHub ${res.status}: ${message ?? res.statusText}`)
  }
  return res.json()
}

export async function loadData(token) {
  const file = await request(token, DATA_PATH)
  return { data: JSON.parse(base64ToText(file.content)), sha: file.sha }
}

// sha: 기존 파일 덮어쓸 때 필수 (다른 사람이 먼저 저장했으면 409로 실패 → 다시 불러오기)
export async function putFile(token, path, base64, message, sha) {
  const res = await request(token, path, {
    method: 'PUT',
    body: JSON.stringify({ message, content: base64, branch: BRANCH, sha }),
  })
  return res.content.sha
}
