import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' + 해시 라우팅: GitHub Pages 하위 경로(/just-landing/)든 커스텀 도메인이든 그대로 동작
export default defineConfig({
  plugins: [react()],
  base: './',
})
