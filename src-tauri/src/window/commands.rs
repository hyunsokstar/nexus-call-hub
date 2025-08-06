// src-tauri/src/window/commands.rs
use super::config::WindowConfigManager;
use super::types::WindowType;
use tauri::{AppHandle, Manager, WebviewUrl, WebviewWindowBuilder};

/// 윈도우 생성
#[tauri::command]
pub async fn open_window(app_handle: AppHandle, window_type: WindowType) -> Result<String, String> {
    let config = WindowConfigManager::get_config(window_type);

    // 이미 존재하는 윈도우면 포커스
    if app_handle.get_webview_window(&config.label).is_some() {
        return focus_window(app_handle, config.label).await;
    }

    let mut builder = WebviewWindowBuilder::new(
        &app_handle,
        &config.label,
        WebviewUrl::App(config.url.into()),
    )
    .title(&config.title)
    .inner_size(config.width, config.height)
    .resizable(config.resizable)
    .decorations(config.decorations)
    .transparent(config.transparent)
    .shadow(config.shadow)
    .always_on_top(config.always_on_top);

    // 개발자 도구 설정 적용
    if config.devtools {
        builder = builder.devtools(true);
    }

    // 최소/최대 크기 설정
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

    // 중앙 배치
    if config.center {
        builder = builder.center();
    }

    let _window = builder.build().map_err(|e| e.to_string())?;

    println!("✅ 윈도우 생성: {} (DevTools: {})", config.label, config.devtools);
    Ok("Window opened successfully".to_string())
}

/// 개발자 도구 열기 안내 (Tauri v2)
#[tauri::command]
pub async fn window_open_devtools(app_handle: AppHandle, label: Option<String>) -> Result<String, String> {
    println!("🛠️ 개발자 도구 열기 시도...");
    
    // 윈도우 찾기
    let window = if let Some(label) = label {
        app_handle.get_webview_window(&label)
    } else {
        // 현재 포커스된 윈도우 또는 첫 번째 윈도우
        app_handle.webview_windows().values().next().cloned()
    };

    if let Some(window) = window {
        // Tauri v2에서는 with_devtools(true)로 빌드된 윈도우에서만 개발자 도구가 작동
        println!("🛠️ 윈도우 '{}' - F12를 눌러 개발자 도구를 여세요", window.label());
        
        // 윈도우에 메시지 전송 (개발자 도구 열기 안내)
        // window.emit("devtools-instruction", "F12 키를 눌러 개발자 도구를 열 수 있습니다").map_err(|e| e.to_string())?;
        
        Ok(format!("윈도우 '{}'에서 F12를 눌러 개발자 도구를 여세요", window.label()))
    } else {
        Err("활성 윈도우를 찾을 수 없습니다".to_string())
    }
}

/// 개발자 도구 닫기 안내 (Tauri v2)
#[tauri::command]
pub async fn window_close_devtools(_app_handle: AppHandle, _label: Option<String>) -> Result<String, String> {
    println!("🔧 개발자 도구 닫기 시도...");
    Ok("개발자 도구를 닫으려면 개발자 도구 창에서 닫기 버튼을 클릭하세요".to_string())
}

/// 모든 윈도우의 개발자 도구 정보
#[tauri::command]
pub async fn window_open_all_devtools(app_handle: AppHandle) -> Result<String, String> {
    let windows = app_handle.webview_windows();
    let count = windows.len();
    
    println!("🛠️ 총 {} 개의 윈도우에서 F12로 개발자 도구를 열 수 있습니다", count);
    Ok(format!("{} 개의 윈도우에서 개발자 도구를 사용할 수 있습니다 (F12)", count))
}

/// 윈도우 닫기
#[tauri::command]
pub async fn close_window(app_handle: AppHandle, label: String) -> Result<String, String> {
    if let Some(window) = app_handle.get_webview_window(&label) {
        window.close().map_err(|e| e.to_string())?;
        println!("❌ 윈도우 닫기: {}", label);
    }
    Ok("Window closed successfully".to_string())
}

/// 윈도우 포커스
#[tauri::command]
pub async fn focus_window(app_handle: AppHandle, label: String) -> Result<String, String> {
    if let Some(window) = app_handle.get_webview_window(&label) {
        window.show().map_err(|e| e.to_string())?;
        window.set_focus().map_err(|e| e.to_string())?;
        window.unminimize().map_err(|e| e.to_string())?;
        println!("🎯 윈도우 포커스: {}", label);
    }
    Ok("Window focused successfully".to_string())
}

/// 윈도우 존재 확인
#[tauri::command]
pub async fn window_exists(app_handle: AppHandle, label: String) -> Result<bool, String> {
    Ok(app_handle.get_webview_window(&label).is_some())
}

/// 🔥 윈도우 전환 (새 윈도우 먼저 생성, 그 다음 기존 윈도우 닫기)
#[tauri::command]
pub async fn switch_window(
    app_handle: AppHandle,
    from_label: String,
    to_window_type: WindowType,
) -> Result<String, String> {
    let to_label = to_window_type.as_str();

    // 🔥 순서 변경: 새 윈도우 먼저 생성
    open_window(app_handle.clone(), to_window_type).await?;

    // 그 다음 기존 윈도우 닫기
    close_window(app_handle, from_label.clone()).await?;

    println!("🔄 윈도우 전환: {} → {}", from_label, to_label);
    Ok("Window switched successfully".to_string())
}

/// 모든 윈도우 닫고 새 윈도우 열기 (새 윈도우 먼저 생성)
#[tauri::command]
pub async fn replace_all_windows(
    app_handle: AppHandle,
    window_type: WindowType,
) -> Result<String, String> {
    let new_label = window_type.as_str();

    // 🔥 순서 변경: 새 윈도우 먼저 생성
    open_window(app_handle.clone(), window_type).await?;

    // 기존 윈도우들 목록 가져오기 (새로 생성된 윈도우 제외)
    let windows: Vec<String> = app_handle
        .webview_windows()
        .keys()
        .filter(|&label| label != new_label) // 새 윈도우는 제외
        .map(|s| s.to_string())
        .collect();

    // 기존 윈도우들 닫기
    for label in windows {
        close_window(app_handle.clone(), label).await?;
    }

    println!("🔄 모든 윈도우 교체 → {}", new_label);
    Ok("All windows replaced successfully".to_string())
}

/// 윈도우 숨기기
#[tauri::command]
pub async fn hide_window(app_handle: AppHandle, label: String) -> Result<String, String> {
    if let Some(window) = app_handle.get_webview_window(&label) {
        window.hide().map_err(|e| e.to_string())?;
        println!("👁️ 윈도우 숨김: {}", label);
    }
    Ok("Window hidden successfully".to_string())
}

/// 윈도우 보이기
#[tauri::command]
pub async fn show_window(app_handle: AppHandle, label: String) -> Result<String, String> {
    if let Some(window) = app_handle.get_webview_window(&label) {
        window.show().map_err(|e| e.to_string())?;
        println!("👀 윈도우 보임: {}", label);
    }
    Ok("Window shown successfully".to_string())
}

/// 모든 윈도우 목록 조회
#[tauri::command]
pub async fn list_windows(app_handle: AppHandle) -> Result<Vec<String>, String> {
    Ok(app_handle
        .webview_windows()
        .keys()
        .map(|s| s.to_string())
        .collect())
}

/// 윈도우 최소화
#[tauri::command]
pub async fn minimize_window(app_handle: AppHandle, label: String) -> Result<String, String> {
    if let Some(window) = app_handle.get_webview_window(&label) {
        window.minimize().map_err(|e| e.to_string())?;
        println!("📉 윈도우 최소화됨: {}", label);
    }
    Ok("Window minimized successfully".to_string())
}

/// 윈도우 최대화
#[tauri::command]
pub async fn maximize_window(app_handle: AppHandle, label: String) -> Result<String, String> {
    if let Some(window) = app_handle.get_webview_window(&label) {
        window.maximize().map_err(|e| e.to_string())?;
        println!("📈 윈도우 최대화됨: {}", label);
    }
    Ok("Window maximized successfully".to_string())
}

/// 윈도우 최대화 해제
#[tauri::command]
pub async fn unmaximize_window(app_handle: AppHandle, label: String) -> Result<String, String> {
    if let Some(window) = app_handle.get_webview_window(&label) {
        window.unmaximize().map_err(|e| e.to_string())?;
        println!("📊 윈도우 최대화 해제됨: {}", label);
    }
    Ok("Window unmaximized successfully".to_string())
}

/// 윈도우 크기 조정
#[tauri::command]
pub async fn resize_window(
    app_handle: AppHandle,
    label: String,
    width: f64,
    height: f64,
) -> Result<String, String> {
    if let Some(window) = app_handle.get_webview_window(&label) {
        window
            .set_size(tauri::Size::Physical(tauri::PhysicalSize {
                width: width as u32,
                height: height as u32,
            }))
            .map_err(|e| e.to_string())?;
        println!("📏 윈도우 크기 조정됨: {} ({}x{})", label, width, height);
    }
    Ok("Window resized successfully".to_string())
}

/// 윈도우 위치 이동
#[tauri::command]
pub async fn move_window(
    app_handle: AppHandle,
    label: String,
    x: i32,
    y: i32,
) -> Result<String, String> {
    if let Some(window) = app_handle.get_webview_window(&label) {
        window
            .set_position(tauri::Position::Physical(tauri::PhysicalPosition { x, y }))
            .map_err(|e| e.to_string())?;
        println!("📍 윈도우 위치 이동됨: {} ({}, {})", label, x, y);
    }
    Ok("Window moved successfully".to_string())
}

/// 윈도우 always_on_top 설정
#[tauri::command]
pub async fn set_always_on_top(
    app_handle: AppHandle,
    label: String,
    always_on_top: bool,
) -> Result<String, String> {
    if let Some(window) = app_handle.get_webview_window(&label) {
        window
            .set_always_on_top(always_on_top)
            .map_err(|e| e.to_string())?;
        let status = if always_on_top {
            "활성화"
        } else {
            "비활성화"
        };
        println!("📌 윈도우 항상 위에 {}: {}", status, label);
    }
    Ok("Window always on top setting updated successfully".to_string())
}
