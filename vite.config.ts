// vite.config.ts
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"
import tailwindcss from '@tailwindcss/vite'


const host = process.env.TAURI_DEV_HOST

export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // ✅ 여기 추가!
    },
  },
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
        protocol: "ws",
        host,
        port: 1421,
      }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },

  // 🎯 멀티 윈도우 빌드 설정 추가
  build: {
    rollupOptions: {
      input: {
        // 메인 앱 (TanStack Router 사용)
        main: path.resolve(__dirname, 'index.html'),

        // 각 독립 윈도우들
        launcher: path.resolve(__dirname, 'launcher.html'),
        login: path.resolve(__dirname, 'login.html'),
        call_inbound: path.resolve(__dirname, 'call_inbound.html'),
        call_outbound: path.resolve(__dirname, 'call_outbound.html'),
        call_bot: path.resolve(__dirname, 'call_bot.html'),
        chat_bot: path.resolve(__dirname, 'chat_bot.html'),

        // 추가 윈도우들 (필요시)
        queue_monitor: path.resolve(__dirname, 'queue_monitor.html'),
        statistics: path.resolve(__dirname, 'statistics.html'),
        settings: path.resolve(__dirname, 'settings.html'),
        share_task_info: path.resolve(__dirname, 'share_task_info.html'),
        company_chat: path.resolve(__dirname, 'company_chat.html'),
      }
    }
  },
})