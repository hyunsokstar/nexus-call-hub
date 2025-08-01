// src/main.tsx
import React from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider, createRouter, createRootRoute, createRoute, Outlet } from '@tanstack/react-router'
import "./index.css"

// 컴포넌트들 import
import LauncherPage from './routes/index'
import LoginPage from './routes/login'


// 🆕 NotFound 컴포넌트 추가
function NotFound() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-red-600">페이지를 찾을 수 없습니다</h1>
      <p>현재 경로: {window.location.pathname}</p>
      <p>사용 가능한 경로: /, /login, /dashboard, /statistics, /settings</p>
    </div>
  )
}

// 루트 라우트 생성 (NotFound 추가)
const rootRoute = createRootRoute({
  component: () => <Outlet />,
  notFoundComponent: NotFound,  // 🆕 추가
})

// 🔥 모든 라우트들 생성
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LauncherPage,  // 런처 페이지 (메인 홈)
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
})


// 🔥 라우트 트리에 모든 라우트 추가
const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,

])

// 라우터 생성 (기본 NotFound도 추가)
const router = createRouter({
  routeTree,
  defaultNotFoundComponent: NotFound,  // 🆕 추가
})

// 타입 등록
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)