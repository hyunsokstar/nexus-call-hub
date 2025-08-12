import React from 'react';
import { Outlet, Link, useLocation } from '@tanstack/react-router';
import CommonHeader from '@/widgets/CommonHeader'; // alias 사용 시
// import CommonHeader from '../../widgets/CommonHeader'; // 상대경로 사용 시

const menu = [
    { to: '/boilerplate/create', label: 'Boilerplate 입력' },  // 새로 추가
    { to: '/boilerplate/list', label: 'Boilerplate 조회' },    // 기존 변경
    { to: '/team-schedule', label: '팀 일정' },
    { to: '/personal-schedule', label: '개인 일정' },
    { to: '/project', label: '프로젝트' },
    { to: '/lecture', label: '강의' },
];

const MainLayout: React.FC = () => {
    const location = useLocation();

    return (
        <div
            className="h-screen flex flex-col"
            style={{
                fontFamily: 'Malgun Gothic, sans-serif',
                backgroundColor: '#f9f9f9',
                borderRadius: '8px',
                overflow: 'hidden'
            }}
        >
            {/* 공통 헤더 */}
            <CommonHeader
                title="공유 업무 정보"
                subtitle="업무 공유 및 일정 관리"
                icon="📋"
                showBackButton={true}
            />

            {/* 네비게이션 메뉴 */}
            <nav
                style={{
                    background: '#f9f9f9',
                    borderBottom: '1px solid #e5e7eb',
                    padding: '8px 24px',
                    display: 'flex',
                    gap: 16,
                }}
            >
                {menu.map(item => (
                    <Link
                        key={item.to}
                        to={item.to}
                        style={{
                            color: location.pathname === item.to ? '#2563eb' : '#333',
                            fontWeight: location.pathname === item.to ? 700 : 400,
                            textDecoration: 'none',
                            padding: '4px 8px',
                            borderRadius: 4,
                            background: location.pathname === item.to ? '#e0e7ff' : 'transparent',
                        }}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>
            <div className="flex flex-1 min-h-0">             {/* 높이 전파 */}
                <div className="flex-1 flex flex-col min-h-0"> {/* 높이 전파 */}
                    <div
                        className="flex-1 px-3 py-4 overflow-hidden min-h-0"
                        style={{ position: 'relative' }}
                    >
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainLayout;