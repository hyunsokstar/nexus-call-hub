use tauri::{AppHandle, Manager, Window, WebviewWindow};

/// 개발자 도구를 열기 위한 명령어
#[tauri::command]
pub async fn open_devtools(window: Window) -> Result<(), String> {
    #[cfg(debug_assertions)]
    {
        window.open_devtools();
        Ok(())
    }
    #[cfg(not(debug_assertions))]
    {
        // 프로덕션 빌드에서도 개발자 도구 열기
        window.open_devtools();
        Ok(())
    }
}

/// 개발자 도구를 닫기 위한 명령어
#[tauri::command]
pub async fn close_devtools(window: Window) -> Result<(), String> {
    window.close_devtools();
    Ok(())
}

/// 개발자 도구가 열려있는지 확인
#[tauri::command]
pub async fn is_devtools_open(window: Window) -> Result<bool, String> {
    Ok(window.is_devtools_open())
}

/// 특정 윈도우의 개발자 도구 열기
#[tauri::command]
pub async fn open_devtools_for_window(app: AppHandle, label: String) -> Result<(), String> {
    if let Some(window) = app.get_webview_window(&label) {
        window.open_devtools();
        Ok(())
    } else {
        Err(format!("Window with label '{}' not found", label))
    }
}

/// 모든 윈도우의 개발자 도구 열기
#[tauri::command]
pub async fn open_devtools_all(app: AppHandle) -> Result<(), String> {
    let windows = app.webview_windows();
    for (_, window) in windows {
        window.open_devtools();
    }
    Ok(())
}

/// 개발자 도구 토글 (열려있으면 닫고, 닫혀있으면 열기)
#[tauri::command]
pub async fn toggle_devtools(window: Window) -> Result<bool, String> {
    if window.is_devtools_open() {
        window.close_devtools();
        Ok(false)
    } else {
        window.open_devtools();
        Ok(true)
    }
}

/// 콘솔 로그를 위한 유틸리티 함수
#[tauri::command]
pub async fn log_to_console(message: String) -> Result<(), String> {
    println!("[DevTools] {}", message);
    Ok(())
}

/// 개발 모드인지 확인
#[tauri::command]
pub async fn is_dev_mode() -> Result<bool, String> {
    Ok(cfg!(debug_assertions))
}

/// 개발자 도구 단축키 정보 반환
#[tauri::command]
pub async fn get_devtools_shortcuts() -> Result<Vec<String>, String> {
    Ok(vec![
        "F12 - Toggle Developer Tools".to_string(),
        "Ctrl+Shift+I - Open Developer Tools".to_string(),
        "Ctrl+Shift+J - Open Console".to_string(),
        "Ctrl+Shift+C - Inspect Element".to_string(),
    ])
}
