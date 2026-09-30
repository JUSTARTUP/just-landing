import assert from 'node:assert'
import { textToBase64, base64ToText, bytesToBase64 } from './github.js'

const text = JSON.stringify({ title: '“우리가 바꾸는 경기” 🏆', award: '대상' }, null, 2)
assert.equal(base64ToText(textToBase64(text)), text)
// GitHub는 60자마다 줄바꿈된 base64를 돌려줌
assert.equal(base64ToText(textToBase64(text).replace(/(.{60})/g, '$1\n')), text)
// 청크 경계(0x8000)를 넘는 바이너리
const bytes = Uint8Array.from({ length: 70000 }, (_, i) => i % 256)
assert.equal(bytesToBase64(bytes), Buffer.from(bytes).toString('base64'))
console.log('ok')
