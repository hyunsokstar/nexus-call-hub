import { Link, useRouterState } from '@tanstack/react-router';
import React from 'react';

const tabs = [
    { label: '업무 템플릿', to: '/boilerplate' },
    { label: '팀 일정', to: '/team-schedule' },
    { label: '개인 일정', to: '/personal-schedule' },
    { label: '프로젝트', to: '/project' },
    { label: '강의', to: '/lecture' },
];

export function HeaderMenuForTaskShare() {
    const router = useRouterState();
    const currentPath = router.location.pathname;

    return (
        <nav className="flex gap-4 px-6 py-3 bg-white rounded-t-lg shadow-sm border-b">
            {tabs.map((tab) => {
                const isActive = currentPath.endsWith(tab.to);
                return (
                    <Link
                        key={tab.to}
                        to={tab.to}
                        className={
                            'px-3 py-1 rounded font-medium transition-colors ' +
                            (isActive
                                ? 'text-blue-600 bg-blue-100'
                                : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50')
                        }
                        activeOptions={{ exact: true }}
                    >
                        {tab.label}
                    </Link>
                );
            })}
        </nav>
    );
}