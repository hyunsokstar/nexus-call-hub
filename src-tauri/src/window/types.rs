// src-tauri/src/window/types.rs
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub enum WindowType {
    Launcher,
    Login,
    CallOutbound,
    CallInbound,
    Statistics,
    Settings,
}

impl WindowType {
    pub fn as_str(&self) -> &'static str {
        match self {
            Self::Launcher => "launcher",
            Self::Login => "login",
            Self::CallOutbound => "call_outbound",
            Self::CallInbound => "call_inbound",
            Self::Statistics => "statistics",
            Self::Settings => "settings",
        }
    }

    pub fn title(&self) -> &'static str {
        match self {
            Self::Launcher => "Nexus Call Hub - 런처",
            Self::Login => "Nexus Call Hub - 로그인",
            Self::CallOutbound => "Nexus Call Hub - 발신 통화",
            Self::CallInbound => "Nexus Call Hub - 수신 통화",
            Self::Statistics => "Nexus Call Hub - 통계",
            Self::Settings => "Nexus Call Hub - 환경설정",
        }
    }

    pub fn size(&self) -> (f64, f64) {
        match self {
            Self::Launcher => (400.0, 600.0),
            Self::Login => (450.0, 500.0),
            Self::CallOutbound => (350.0, 500.0),
            Self::CallInbound => (350.0, 400.0),
            Self::Statistics => (1000.0, 700.0),
            Self::Settings => (600.0, 500.0),
        }
    }

    // 모든 윈도우는 같은 앱을 로드 - 라우팅은 React에서 담당
    pub fn url(&self) -> String {
        if cfg!(dev) {
            "http://localhost:1420".to_string()
        } else {
            "index.html".to_string()
        }
    }
}
