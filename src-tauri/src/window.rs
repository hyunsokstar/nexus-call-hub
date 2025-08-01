use tauri::{AppHandle, Manager};

// 1단계: 가장 간단한 enum
#[derive(Debug, Clone)]
pub enum WindowType {
    Launcher, // 일단 이것만!
}

// 1단계: 기본 구조 이해
#[derive(Debug, Clone)]
pub struct WindowConfig {
    pub label: String,
    pub title: String,
    pub url: String,
    pub width: f64,
    pub height: f64,
    pub resizable: bool,
    pub center: bool,
}

// 1단계: 가장 간단한 설정
pub struct WindowConfigs;

impl WindowConfigs {
    pub fn get(window_type: WindowType) -> WindowConfig {
        match window_type {
            WindowType::Launcher => WindowConfig {
                label: "launcher".to_string(),
                title: "Nexus Call Hub - 런처".to_string(),
                url: "launcher/index.html".to_string(),
                width: 400.0,
                height: 500.0,
                resizable: false,
                center: true,
            },
        }
    }
}

// ✅ Tauri 2.x용 새로운 윈도우 생성 함수
pub fn create_window(app_handle: &AppHandle, window_type: WindowType) -> Result<(), tauri::Error> {
    let config = WindowConfigs::get(window_type);

    // Tauri 2.x에서는 WebviewWindowBuilder 사용
    let window = tauri::WebviewWindowBuilder::new(
        app_handle,
        &config.label,
        tauri::WebviewUrl::App(config.url.into()),
    )
    .title(&config.title)
    .inner_size(config.width, config.height)
    .resizable(config.resizable);

    let window = if config.center {
        window.center()
    } else {
        window
    };

    window.build()?;

    Ok(())
}
