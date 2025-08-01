use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Manager, WebviewUrl, WebviewWindowBuilder};

/// 윈도우 타입 정의
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum WindowType {
    Launcher,
    Login,
    CallOutbound,
    CallInbound,
    Statistics,
    Settings,
}

impl WindowType {
    /// 윈도우 타입을 문자열로 변환
    pub fn as_str(&self) -> &'static str {
        match self {
            WindowType::Launcher => "launcher",
            WindowType::Login => "login",
            WindowType::CallOutbound => "call_outbound",
            WindowType::CallInbound => "call_inbound",
            WindowType::Statistics => "statistics",
            WindowType::Settings => "settings",
        }
    }
}

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
pub struct WindowConfigs;

impl WindowConfigs {
    /// 윈도우 타입에 따른 설정 반환
    pub fn get(window_type: WindowType) -> WindowConfig {
        match window_type {
            WindowType::Launcher => WindowConfig {
                label: "launcher".to_string(),
                title: "Nexus Call Hub - 런처".to_string(),
                // 🔥 TanStack Router 루트 경로로 수정
                url: if cfg!(dev) {
                    "http://localhost:1420/".to_string()
                } else {
                    "index.html".to_string()
                },
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
            },

            WindowType::Login => WindowConfig {
                label: "login".to_string(),
                title: "Nexus Call Hub - 로그인".to_string(),
                // 🔥 로그인 라우트로 직접 이동
                url: if cfg!(dev) {
                    "http://localhost:1420/login".to_string()
                } else {
                    "index.html#/login".to_string()
                },
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
            },

            WindowType::CallOutbound => WindowConfig {
                label: "call_outbound".to_string(),
                title: "Nexus Call Hub - 발신 통화".to_string(),
                // 🔥 대시보드 라우트로 수정
                url: if cfg!(dev) {
                    "http://localhost:1420/dashboard".to_string()
                } else {
                    "index.html#/dashboard".to_string()
                },
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
            },

            WindowType::CallInbound => WindowConfig {
                label: "call_inbound".to_string(),
                title: "Nexus Call Hub - 수신 통화".to_string(),
                // 🔥 대시보드 라우트로 수정 (통화 관련은 대시보드에서 통합 관리)
                url: if cfg!(dev) {
                    "http://localhost:1420/dashboard".to_string()
                } else {
                    "index.html#/dashboard".to_string()
                },
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
            },

            WindowType::Statistics => WindowConfig {
                label: "statistics".to_string(),
                title: "Nexus Call Hub - 통계".to_string(),
                // 🔥 통계 라우트로 수정
                url: if cfg!(dev) {
                    "http://localhost:1420/statistics".to_string()
                } else {
                    "index.html#/statistics".to_string()
                },
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
            },

            WindowType::Settings => WindowConfig {
                label: "settings".to_string(),
                title: "Nexus Call Hub - 환경설정".to_string(),
                // 🔥 설정 라우트로 수정
                url: if cfg!(dev) {
                    "http://localhost:1420/settings".to_string()
                } else {
                    "index.html#/settings".to_string()
                },
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
            },
        }
    }
}

/// 윈도우 매니저
pub struct WindowManager;

impl WindowManager {
    /// 새 윈도우 생성
    pub fn create_window(
        app_handle: &AppHandle,
        window_type: WindowType,
    ) -> Result<(), tauri::Error> {
        let config = WindowConfigs::get(window_type.clone());

        // 이미 존재하는 윈도우인지 확인
        if app_handle.get_webview_window(&config.label).is_some() {
            return Self::focus_window(app_handle, &config.label);
        }

        // 윈도우 빌더 생성
        let mut builder = WebviewWindowBuilder::new(
            app_handle,
            &config.label,
            WebviewUrl::App(config.url.into()),
        )
        .title(&config.title)
        .inner_size(config.width, config.height)
        .resizable(config.resizable)
        .decorations(config.decorations)
        .shadow(config.shadow)
        .always_on_top(config.always_on_top);

        // 선택적 속성 설정
        if let Some(min_width) = config.min_width {
            if let Some(min_height) = config.min_height {
                builder = builder.min_inner_size(min_width, min_height);
            }
        }

        if let Some(max_width) = config.max_width {
            if let Some(max_height) = config.max_height {
                builder = builder.max_inner_size(max_width, max_height);
            }
        }

        if config.center {
            builder = builder.center();
        }

        if config.transparent {
            builder = builder.transparent(true);
        }

        // 윈도우 생성
        builder.build()?;

        println!("✅ 윈도우 생성됨: {} ({})", config.title, config.label);
        Ok(())
    }

    /// 윈도우 포커스
    pub fn focus_window(app_handle: &AppHandle, label: &str) -> Result<(), tauri::Error> {
        if let Some(window) = app_handle.get_webview_window(label) {
            window.show()?;
            window.set_focus()?;
            window.unminimize()?;
            println!("🎯 윈도우 포커스됨: {}", label);
        }
        Ok(())
    }

    /// 윈도우 닫기
    pub fn close_window(app_handle: &AppHandle, label: &str) -> Result<(), tauri::Error> {
        if let Some(window) = app_handle.get_webview_window(label) {
            window.close()?;
            println!("❌ 윈도우 닫힘: {}", label);
        }
        Ok(())
    }

    /// 윈도우 숨기기
    pub fn hide_window(app_handle: &AppHandle, label: &str) -> Result<(), tauri::Error> {
        if let Some(window) = app_handle.get_webview_window(label) {
            window.hide()?;
            println!("👁️ 윈도우 숨김: {}", label);
        }
        Ok(())
    }

    /// 모든 윈도우 목록 조회
    pub fn list_windows(app_handle: &AppHandle) -> Vec<String> {
        app_handle
            .webview_windows()
            .keys()
            .map(|s| s.to_string())
            .collect()
    }

    /// 윈도우 존재 여부 확인
    pub fn window_exists(app_handle: &AppHandle, label: &str) -> bool {
        app_handle.get_webview_window(label).is_some()
    }

    /// 윈도우 최소화
    pub fn minimize_window(app_handle: &AppHandle, label: &str) -> Result<(), tauri::Error> {
        if let Some(window) = app_handle.get_webview_window(label) {
            window.minimize()?;
            println!("📉 윈도우 최소화됨: {}", label);
        }
        Ok(())
    }

    /// 윈도우 최대화
    pub fn maximize_window(app_handle: &AppHandle, label: &str) -> Result<(), tauri::Error> {
        if let Some(window) = app_handle.get_webview_window(label) {
            window.maximize()?;
            println!("📈 윈도우 최대화됨: {}", label);
        }
        Ok(())
    }

    /// 윈도우 크기 조정
    pub fn resize_window(
        app_handle: &AppHandle,
        label: &str,
        width: f64,
        height: f64,
    ) -> Result<(), tauri::Error> {
        if let Some(window) = app_handle.get_webview_window(label) {
            window.set_size(tauri::Size::Physical(tauri::PhysicalSize {
                width: width as u32,
                height: height as u32,
            }))?;
            println!("📏 윈도우 크기 조정됨: {} ({}x{})", label, width, height);
        }
        Ok(())
    }
}

/// Tauri 명령어들
#[tauri::command]
pub async fn open_window(app_handle: AppHandle, window_type: WindowType) -> Result<String, String> {
    WindowManager::create_window(&app_handle, window_type).map_err(|e| e.to_string())?;
    Ok("Window opened successfully".to_string())
}

#[tauri::command]
pub async fn close_window_cmd(app_handle: AppHandle, label: String) -> Result<String, String> {
    WindowManager::close_window(&app_handle, &label).map_err(|e| e.to_string())?;
    Ok("Window closed successfully".to_string())
}

#[tauri::command]
pub async fn focus_window_cmd(app_handle: AppHandle, label: String) -> Result<String, String> {
    WindowManager::focus_window(&app_handle, &label).map_err(|e| e.to_string())?;
    Ok("Window focused successfully".to_string())
}

#[tauri::command]
pub async fn list_windows_cmd(app_handle: AppHandle) -> Result<Vec<String>, String> {
    Ok(WindowManager::list_windows(&app_handle))
}

#[tauri::command]
pub async fn window_exists_cmd(app_handle: AppHandle, label: String) -> Result<bool, String> {
    Ok(WindowManager::window_exists(&app_handle, &label))
}
