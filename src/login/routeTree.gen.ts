// C:\nexus-call-hub\src\login\routeTree.gen.ts
/* eslint-disable */
/* prettier-ignore */

import { Route as rootRoute } from './routes/__root'
import { Route as IndexRoute } from './routes/index'
import { Route as SignupRoute } from './routes/signup'

// 로그인 전용 라우터 타입 정의 (전역 모듈 확장 없이)
export interface LoginFileRoutesByPath {
  '/': {
    id: '/'
    path: '/'
    fullPath: '/'
    preLoaderRoute: typeof IndexRoute
    parentRoute: typeof rootRoute
  }
  '/signup': {
    id: '/signup'
    path: '/signup'
    fullPath: '/signup'
    preLoaderRoute: typeof SignupRoute
    parentRoute: typeof rootRoute
  }
}

// Create and export the route tree
export const routeTree = rootRoute.addChildren([
  IndexRoute,
  SignupRoute,
])

export type RouteTree = typeof routeTree
