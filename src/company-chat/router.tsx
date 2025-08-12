import { createRouter, createRoute, createRootRoute, redirect, createHashHistory, Outlet } from '@tanstack/react-router'
import RoomsListPage from './pages/RoomsListPage'
import RoomPage from './pages/RoomPage'

const Root = () => <Outlet />

const rootRoute = createRootRoute({ component: Root })

const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    beforeLoad: () => { throw redirect({ to: '/rooms' }) },
})

const roomsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/rooms',
    component: RoomsListPage,
})

const roomRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/rooms/$roomId',
    component: RoomPage,
})

const routeTree = rootRoute.addChildren([
    indexRoute,
    roomsRoute,
    roomRoute,
])

export const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    history: createHashHistory(),
})

declare module '@tanstack/react-router' {
    interface Register { router: typeof router }
}
