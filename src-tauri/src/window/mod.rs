// src-tauri/src/window/mod.rs
pub mod commands;
pub mod config;
pub mod types;

use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub enum WindowType {
    Login,
    Launcher,
    CallInbound,
    CallOutbound,
    CallBot,
    ChatBot,
    QueueMonitor,
    Statistics,
    Settings,
}

impl WindowType {
    pub fn to_label(&self) -> &'static str {
        match self {
            WindowType::Login => "login",
            WindowType::Launcher => "launcher",
            WindowType::CallInbound => "call_inbound",
            WindowType::CallOutbound => "call_outbound",
            WindowType::CallBot => "call_bot",
            WindowType::ChatBot => "chat_bot",
            WindowType::QueueMonitor => "queue_monitor",
            WindowType::Statistics => "statistics",
            WindowType::Settings => "settings",
        }
    }

    pub fn title(&self) -> &'static str {
        match self {
            WindowType::Login => "Nexus Call Hub - 로그인",
            WindowType::Launcher => "Nexus Call Hub - 런처",
            WindowType::CallInbound => "Nexus Call Hub - 인바운드 상담",
            WindowType::CallOutbound => "Nexus Call Hub - 아웃바운드 영업",
            WindowType::CallBot => "Nexus Call Hub - AI 콜봇",
            WindowType::ChatBot => "Nexus Call Hub - 챗봇 테스트",
            WindowType::QueueMonitor => "Nexus Call Hub - 대기열 모니터",
            WindowType::Statistics => "Nexus Call Hub - 통계",
            WindowType::Settings => "Nexus Call Hub - 설정",
        }
    }

    pub fn url(&self) -> &'static str {
        match self {
            WindowType::Login => "login.html",
            WindowType::Launcher => "launcher.html",
            WindowType::CallInbound => "call_inbound.html",
            WindowType::CallOutbound => "call_outbound.html",
            WindowType::CallBot => "call_bot.html",
            WindowType::ChatBot => "chat_bot.html",
            WindowType::QueueMonitor => "queue_monitor.html",
            WindowType::Statistics => "statistics.html",
            WindowType::Settings => "settings.html",
        }
    }

    pub fn default_size(&self) -> (f64, f64) {
        match self {
            WindowType::Login => (400.0, 600.0),
            WindowType::Launcher => (800.0, 600.0),
            WindowType::CallInbound => (1200.0, 800.0),
            WindowType::CallOutbound => (1200.0, 800.0),
            WindowType::CallBot => (1000.0, 700.0),
            WindowType::ChatBot => (1400.0, 900.0),
            WindowType::QueueMonitor => (1000.0, 600.0),
            WindowType::Statistics => (1200.0, 800.0),
            WindowType::Settings => (800.0, 600.0),
        }
    }

    // 🔥 사용되지 않는 함수들 제거
    // pub fn min_size(&self) -> Option<(f64, f64)> { ... }
    // pub fn is_resizable(&self) -> bool { ... }
    // pub fn default_position_offset(&self) -> Option<(i32, i32)> { ... }
}
