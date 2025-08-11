// src-tauri/src/window/types.rs
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub enum WindowType {
    Launcher,
    Login,
    CallOutbound,
    CallInbound,
    CallBot,
    ChatBot,
    QueueMonitor,
    Statistics,
    Settings,
    ShareTaskInfo,
    CompanyChat,
}

impl WindowType {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Launcher => "launcher",
            Self::Login => "login",
            Self::CallOutbound => "call_outbound",
            Self::CallInbound => "call_inbound",
            Self::CallBot => "call_bot",
            Self::ChatBot => "chat_bot",
            Self::QueueMonitor => "queue_monitor",
            Self::Statistics => "statistics",
            Self::Settings => "settings",
            Self::ShareTaskInfo => "share_task_info",
            Self::CompanyChat => "company_chat",
        }
    }

    pub fn title(&self) -> &'static str {
        match self {
            Self::Launcher => "Nexus Call Hub - 런처",
            Self::Login => "Nexus Call Hub - 로그인",
            Self::CallOutbound => "Nexus Call Hub - 아웃바운드 영업",
            Self::CallInbound => "Nexus Call Hub - 인바운드 상담",
            Self::CallBot => "Nexus Call Hub - AI 콜봇",
            Self::ChatBot => "Nexus Call Hub - 챗봇 테스트",
            Self::QueueMonitor => "Nexus Call Hub - 실시간 대기열",
            Self::Statistics => "Nexus Call Hub - 통계 대시보드",
            Self::Settings => "Nexus Call Hub - 환경설정",
            Self::ShareTaskInfo => "공유 업무 정보",
            Self::CompanyChat => "Nexus Call Hub - Company Chat",
        }
    }

    pub fn size(&self) -> (f64, f64) {
        match self {
            Self::Launcher => (800.0, 700.0),        // 런처: 적당한 크기
            Self::Login => (450.0, 630.0),           // 로그인: 작은 크기
            Self::CallOutbound => (1200.0, 800.0), // 아웃바운드: 넓은 화면 (캠페인 정보 + 스크립트)
            Self::CallInbound => (1300.0, 900.0), // 인바운드: 가장 큰 화면 ✅ (고객 정보 + 상담 내용)
            Self::CallBot => (1100.0, 800.0),     // AI 콜봇: 중간-큰 화면 (AI 대화 + 제어 패널)
            Self::ChatBot => (1200.0, 900.0), // 챗봇 테스트: 큰 크기 (채팅 UI + 테스트 패널) ✅ 업그레이드
            Self::QueueMonitor => (1000.0, 700.0), // 대기열 모니터: 중간 크기 (여러 상담원 상태)
            Self::Statistics => (1400.0, 1000.0), // 통계: 대형 화면 (차트 + 대시보드)
            Self::Settings => (600.0, 500.0), // 설정: 작은 크기
            Self::ShareTaskInfo => (1920.0, 1080.0), // 공유 업무 정보: 풀사이즈
            Self::CompanyChat => (1200.0, 800.0), // Company Chat: 기본 크기
        }
    }

    // 각 윈도우별 독립 HTML 파일 로드
    pub fn url(&self) -> String {
        if cfg!(dev) {
            format!("http://localhost:1420/{}.html", self.as_str())
        } else {
            format!("{}.html", self.as_str())
        }
    }

    // 윈도우별 최소 크기 (리사이즈 제한)
    pub fn min_size(&self) -> Option<(f64, f64)> {
        match self {
            Self::CallInbound => Some((1100.0, 700.0)), // 인바운드는 최소 크기 제한
            Self::CallOutbound => Some((1000.0, 600.0)), // 아웃바운드도 최소 크기 제한
            Self::CallBot => Some((900.0, 600.0)),      // AI 콜봇 최소 크기 제한
            Self::ChatBot => Some((1000.0, 700.0)),     // 챗봇 테스트 최소 크기 제한 ✅ 추가
            Self::Statistics => Some((1200.0, 800.0)),  // 통계는 큰 최소 크기
            Self::QueueMonitor => Some((800.0, 500.0)), // 대기열 모니터 최소 크기
            Self::ShareTaskInfo => Some((1280.0, 800.0)), // 공유 업무 정보: 넉넉한 최소 크기
            _ => None,                                  // 나머지는 자유롭게 리사이즈
        }
    }

    // 윈도우별 리사이즈 가능 여부
    pub fn is_resizable(&self) -> bool {
        match self {
            Self::Launcher => false, // 런처: 고정 크기
            Self::Login => false,    // 로그인: 고정 크기
            Self::Settings => false, // 설정: 고정 크기
            _ => true,               // 나머지: 리사이즈 가능
        }
    }

    // 윈도우별 기본 위치 (센터 기준 오프셋)
    pub fn default_position_offset(&self) -> Option<(i32, i32)> {
        match self {
            Self::CallInbound => Some((100, 50)), // 인바운드: 약간 오른쪽 위
            Self::CallOutbound => Some((-100, 50)), // 아웃바운드: 약간 왼쪽 위
            Self::CallBot => Some((0, 100)),      // AI 콜봇: 약간 아래 중앙
            Self::QueueMonitor => Some((0, -100)), // 대기열: 약간 아래
            Self::Statistics => Some((150, 100)), // 통계: 오른쪽 아래
            _ => None,                            // 나머지는 센터
        }
    }
}

impl Default for WindowType {
    fn default() -> Self {
        Self::Login
    }
}
