use super::types::WindowType;

/// 윈도우 설정 구조체
#[derive(Debug, Clone)]
pub struct WindowConfig {
    pub label: String,
    pub title: String,
    pub url: String,
    pub width: f64,
    pub height: f64,
    pub min_width: Option<f64>,
    pub min_height: Option<f64>,
    pub max_width: Option<f64>,
    pub max_height: Option<f64>,
    pub resizable: bool,
    pub center: bool,
    pub always_on_top: bool,
    pub decorations: bool,
    pub transparent: bool,
    pub shadow: bool,
    pub devtools: bool,
}

impl Default for WindowConfig {
    fn default() -> Self {
        Self {
            label: String::new(),
            title: String::new(),
            url: String::new(),
            width: 800.0,
            height: 600.0,
            min_width: None,
            min_height: None,
            max_width: None,
            max_height: None,
            resizable: true,
            center: true,
            always_on_top: false,
            decorations: true,
            transparent: false,
            shadow: true,
            devtools: true, // 기본적으로 개발자 도구 활성화
        }
    }
}

/// 윈도우 설정 관리자
pub struct WindowConfigManager;

impl WindowConfigManager {
    /// 윈도우 타입에 따른 설정 반환
    pub fn get_config(window_type: WindowType) -> WindowConfig {
        match window_type {
            WindowType::Launcher => Self::launcher_config(),
            WindowType::Login => Self::login_config(),
            WindowType::CallOutbound => Self::call_outbound_config(),
            WindowType::CallInbound => Self::call_inbound_config(),
            WindowType::CallBot => Self::call_bot_config(),
            WindowType::ChatBot => Self::chat_bot_config(),
            WindowType::QueueMonitor => Self::queue_monitor_config(),
            WindowType::Statistics => Self::statistics_config(),
            WindowType::Settings => Self::settings_config(),
            WindowType::ShareTaskInfo => Self::share_task_info_config(),
            WindowType::CompanyChat => Self::company_chat_config(),
        }
    }

    /// 개발/프로덕션 환경에 따른 URL 생성
    fn get_url(path: &str) -> String {
        if cfg!(dev) {
            format!("http://localhost:1420{}", path)
        } else {
            if path == "/" {
                "index.html".to_string()
            } else {
                format!("index.html#{}", path)
            }
        }
    }

    /// 런처 윈도우 설정
    fn launcher_config() -> WindowConfig {
        WindowConfig {
            label: WindowType::Launcher.as_str().to_string(),
            title: WindowType::Launcher.title().to_string(),
            url: WindowType::Launcher.url(),
            width: 400.0,
            height: 600.0,
            min_width: Some(380.0),
            min_height: Some(500.0),
            max_width: Some(450.0),
            max_height: Some(700.0),
            resizable: true,
            center: true,
            always_on_top: false,
            decorations: true,
            transparent: false,
            shadow: true,
            devtools: true,
        }
    }

    /// 로그인 윈도우 설정
    fn login_config() -> WindowConfig {
        WindowConfig {
            label: WindowType::Login.as_str().to_string(),
            title: WindowType::Login.title().to_string(),
            url: WindowType::Login.url(),
            width: 450.0,
            height: 500.0,
            min_width: Some(400.0),
            min_height: Some(450.0),
            max_width: None,
            max_height: None,
            resizable: false,
            center: true,
            always_on_top: true,
            decorations: true,
            transparent: false,
            shadow: true,
            devtools: true,
        }
    }

    /// 발신 통화 윈도우 설정
    fn call_outbound_config() -> WindowConfig {
        WindowConfig {
            label: WindowType::CallOutbound.as_str().to_string(),
            title: WindowType::CallOutbound.title().to_string(),
            url: WindowType::CallOutbound.url(),
            width: 350.0,
            height: 500.0,
            min_width: Some(320.0),
            min_height: Some(450.0),
            max_width: None,
            max_height: None,
            resizable: true,
            center: true,
            always_on_top: true,
            decorations: true,
            transparent: false,
            shadow: true,
            devtools: true,
        }
    }

    /// 수신 통화 윈도우 설정
    fn call_inbound_config() -> WindowConfig {
        WindowConfig {
            label: WindowType::CallInbound.as_str().to_string(),
            title: WindowType::CallInbound.title().to_string(),
            url: WindowType::CallInbound.url(),
            width: 350.0,
            height: 400.0,
            min_width: Some(320.0),
            min_height: Some(350.0),
            max_width: None,
            max_height: None,
            resizable: true,
            center: true,
            always_on_top: true,
            decorations: true,
            transparent: false,
            shadow: true,
            devtools: true,
        }
    }

    /// 통계 윈도우 설정
    fn statistics_config() -> WindowConfig {
        WindowConfig {
            label: WindowType::Statistics.as_str().to_string(),
            title: WindowType::Statistics.title().to_string(),
            url: WindowType::Statistics.url(),
            width: 1000.0,
            height: 700.0,
            min_width: Some(800.0),
            min_height: Some(600.0),
            max_width: None,
            max_height: None,
            resizable: true,
            center: true,
            always_on_top: false,
            decorations: true,
            transparent: false,
            shadow: true,
            devtools: true,
        }
    }

    /// 설정 윈도우 설정
    fn settings_config() -> WindowConfig {
        WindowConfig {
            label: WindowType::Settings.as_str().to_string(),
            title: WindowType::Settings.title().to_string(),
            url: WindowType::Settings.url(),
            width: 600.0,
            height: 500.0,
            min_width: Some(500.0),
            min_height: Some(400.0),
            max_width: None,
            max_height: None,
            resizable: true,
            center: true,
            always_on_top: false,
            decorations: true,
            transparent: false,
            shadow: true,
            devtools: true,
        }
    }

    /// 콜봇 윈도우 설정
    fn call_bot_config() -> WindowConfig {
        WindowConfig {
            label: WindowType::CallBot.as_str().to_string(),
            title: WindowType::CallBot.title().to_string(),
            url: WindowType::CallBot.url(),
            width: 1100.0,
            height: 800.0,
            min_width: Some(900.0),
            min_height: Some(600.0),
            max_width: None,
            max_height: None,
            resizable: true,
            center: true,
            always_on_top: false,
            decorations: true,
            transparent: false,
            shadow: true,
            devtools: true,
        }
    }

    /// 챗봇 윈도우 설정
    fn chat_bot_config() -> WindowConfig {
        WindowConfig {
            label: WindowType::ChatBot.as_str().to_string(),
            title: WindowType::ChatBot.title().to_string(),
            url: WindowType::ChatBot.url(),
            width: 1200.0,
            height: 900.0,
            min_width: Some(1000.0),
            min_height: Some(700.0),
            max_width: None,
            max_height: None,
            resizable: true,
            center: true,
            always_on_top: false,
            decorations: true,
            transparent: false,
            shadow: true,
            devtools: true,
        }
    }
    /// 큐 모니터 윈도우 설정
    fn queue_monitor_config() -> WindowConfig {
        WindowConfig {
            label: WindowType::QueueMonitor.as_str().to_string(),
            title: WindowType::QueueMonitor.title().to_string(),
            url: WindowType::QueueMonitor.url(),
            width: 1000.0,
            height: 700.0,
            min_width: Some(800.0),
            min_height: Some(500.0),
            max_width: None,
            max_height: None,
            resizable: true,
            center: true,
            always_on_top: false,
            decorations: true,
            transparent: false,
            shadow: true,
            devtools: true,
        }
    }

    /// 공유 작업 정보 윈도우 설정
    fn share_task_info_config() -> WindowConfig {
        WindowConfig {
            label: WindowType::ShareTaskInfo.as_str().to_string(),
            title: WindowType::ShareTaskInfo.title().to_string(),
            url: WindowType::ShareTaskInfo.url(),
            width: 1920.0,
            height: 1080.0,
            min_width: Some(1280.0),
            min_height: Some(800.0),
            max_width: None,
            max_height: None,
            resizable: true,
            center: true,
            always_on_top: false,
            decorations: true,
            transparent: false,
            shadow: true,
            devtools: true,
        }
    }

    /// Company Chat 윈도우 설정
    fn company_chat_config() -> WindowConfig {
        WindowConfig {
            label: WindowType::CompanyChat.as_str().to_string(),
            title: WindowType::CompanyChat.title().to_string(),
            url: WindowType::CompanyChat.url(),
            width: 1200.0,
            height: 800.0,
            min_width: Some(900.0),
            min_height: Some(600.0),
            max_width: None,
            max_height: None,
            resizable: true,
            center: true,
            always_on_top: false,
            decorations: true,
            transparent: false,
            shadow: true,
            devtools: true,
        }
    }
}
