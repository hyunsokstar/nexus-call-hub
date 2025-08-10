// router.tsx
import { createRouter, createRoute, createRootRoute, redirect, createHashHistory } from '@tanstack/react-router';
import MainLayout from './layouts/MainLayout';
import BoilerplatePage from './pages/BoilerplatePage';
import BoilerplateCreatePage from './pages/BoilerplateCreatePage'; // 입력 페이지
import BoilerplateListPage from './pages/BoilerplateListPage';     // 조회 페이지 (새로 추가)
import TeamSchedulePage from './pages/TeamSchedulePage';
import PersonalSchedulePage from './pages/PersonalSchedulePage';
import ProjectPage from './pages/ProjectPage';
import LecturePage from './pages/LecturePage';

// 루트 라우트
const rootRoute = createRootRoute({
    component: MainLayout,
});

// 각 페이지 라우트
const boilerplateRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/boilerplate',
    component: BoilerplatePage, // 기존 유지 (또는 리다이렉트로 변경)
});

// 보일러플레이트 입력 페이지
const boilerplateCreateRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/boilerplate/create',
    component: BoilerplateCreatePage,
});

// 보일러플레이트 조회 페이지
const boilerplateListRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/boilerplate/list',
    component: BoilerplateListPage,
});

const teamScheduleRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/team-schedule',
    component: TeamSchedulePage,
});
const personalScheduleRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/personal-schedule',
    component: PersonalSchedulePage,
});
const projectRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/project',
    component: ProjectPage,
});
const lectureRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/lecture',
    component: LecturePage,
});

// 인덱스 라우트 (리다이렉트)
const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    beforeLoad: () => {
        throw redirect({ to: '/boilerplate' });
    },
});

// 라우트 트리
const routeTree = rootRoute.addChildren([
    indexRoute,
    boilerplateRoute,
    boilerplateCreateRoute,
    boilerplateListRoute,
    teamScheduleRoute,
    personalScheduleRoute,
    projectRoute,
    lectureRoute,
]);

export const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    history: createHashHistory(),
});

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

