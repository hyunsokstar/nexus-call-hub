// C:\nexus-call-hub\src\login\routes\__root.tsx
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
    component: () => (
        <>
            <Outlet />
            {/* 개발 환경에서만 Router DevTools 표시 */}
            {import.meta.env.DEV && <TanStackRouterDevtools />}
        </>
    ),
})
