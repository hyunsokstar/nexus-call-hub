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
            WindowType::Statistics => Self::statistics_config(),
            WindowType::Settings => Self::settings_config(),
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
            title: WindowType::Launcher.default_title().to_string(),
            url: Self::get_url(WindowType::Launcher.default_route()),
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
        }
    }

    /// 로그인 윈도우 설정
    fn login_config() -> WindowConfig {
        WindowConfig {
            label: WindowType::Login.as_str().to_string(),
            title: WindowType::Login.default_title().to_string(),
            url: Self::get_url(WindowType::Login.default_route()),
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
        }
    }

    /// 발신 통화 윈도우 설정
    fn call_outbound_config() -> WindowConfig {
        WindowConfig {
            label: WindowType::CallOutbound.as_str().to_string(),
            title: WindowType::CallOutbound.default_title().to_string(),
            url: Self::get_url(WindowType::CallOutbound.default_route()),
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
        }
    }

    /// 수신 통화 윈도우 설정
    fn call_inbound_config() -> WindowConfig {
        WindowConfig {
            label: WindowType::CallInbound.as_str().to_string(),
            title: WindowType::CallInbound.default_title().to_string(),
            url: Self::get_url(WindowType::CallInbound.default_route()),
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
        }
    }

    /// 통계 윈도우 설정
    fn statistics_config() -> WindowConfig {
        WindowConfig {
            label: WindowType::Statistics.as_str().to_string(),
            title: WindowType::Statistics.default_title().to_string(),
            url: Self::get_url(WindowType::Statistics.default_route()),
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
        }
    }

    /// 설정 윈도우 설정
    fn settings_config() -> WindowConfig {
        WindowConfig {
            label: WindowType::Settings.as_str().to_string(),
            title: WindowType::Settings.default_title().to_string(),
            url: Self::get_url(WindowType::Settings.default_route()),
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
        }
    }
}
