use tauri::{Manager, WebviewWindow};

/// 메인 창 찾기 (여러 창 중에서)
pub fn find_main_window(app: &tauri::AppHandle) -> Option<(String, WebviewWindow)> {
    let windows = app.webview_windows();
    for (label, window) in windows.iter() {
        if label.starts_with("login")
            || label.starts_with("launcher")
            || label.starts_with("dashboard")
            || label.starts_with("chatbot")
        {
            return Some((label.clone(), window.clone()));
        }
    }
    // 첫 번째 창 반환 (fallback)
    windows.iter().next().map(|(label, window)| (label.clone(), window.clone()))
}

#[tauri::command]
pub fn open_devtools(app: tauri::AppHandle) -> Result<(), String> {
    if let Some((label, window)) = find_main_window(&app) {
        window.open_devtools();
        println!("🔧 개발자 도구 열기 - 창: {}", label);
        Ok(())
    } else {
        Err("창을 찾을 수 없습니다".to_string())
    }
}

#[tauri::command]
pub fn close_devtools(app: tauri::AppHandle) -> Result<(), String> {
    if let Some((label, window)) = find_main_window(&app) {
        window.close_devtools();
        println!("🔧 개발자 도구 닫기 - 창: {}", label);
        Ok(())
    } else {
        Err("창을 찾을 수 없습니다".to_string())
    }
}

#[tauri::command]
pub fn toggle_devtools(app: tauri::AppHandle) -> Result<bool, String> {
    if let Some((label, window)) = find_main_window(&app) {
        if window.is_devtools_open() {
            window.close_devtools();
            println!("🔧 개발자 도구 닫기 - 창: {}", label);
            Ok(false)
        } else {
            window.open_devtools();
            println!("🔧 개발자 도구 열기 - 창: {}", label);
            Ok(true)
        }
    } else {
        Err("창을 찾을 수 없습니다".to_string())
    }
}

/// 현재 창의 개발자 도구 열기
#[tauri::command]
pub fn open_current_devtools(window: WebviewWindow) -> Result<(), String> {
    window.open_devtools();
    println!("🔧 현재 창의 개발자 도구 열기");
    Ok(())
}

/// 현재 창의 개발자 도구 닫기
#[tauri::command]
pub fn close_current_devtools(window: WebviewWindow) -> Result<(), String> {
    window.close_devtools();
    println!("🔧 현재 창의 개발자 도구 닫기");
    Ok(())
}

/// 개발자 도구가 열려있는지 확인
#[tauri::command]
pub fn is_devtools_open(window: WebviewWindow) -> Result<bool, String> {
    let is_open = window.is_devtools_open();
    println!("🔧 개발자 도구 상태: {}", if is_open { "열림" } else { "닫힘" });
    Ok(is_open)
}

/// 개발 모드인지 확인
#[tauri::command]
pub fn is_dev_mode() -> Result<bool, String> {
    Ok(cfg!(debug_assertions))
}

/// 개발자 도구 단축키 정보 반환
#[tauri::command]
pub fn get_devtools_shortcuts() -> Result<Vec<String>, String> {
    Ok(vec![
        "F12 - Toggle Developer Tools".to_string(),
        "Ctrl+Shift+I - Open Developer Tools".to_string(),
        "Ctrl+Shift+J - Open Console".to_string(),
        "Ctrl+Shift+C - Inspect Element".to_string(),
    ])
}
