// src-tauri/src/window/commands.rs
use super::types::WindowType;
use tauri::{AppHandle, Manager, WebviewUrl, WebviewWindowBuilder};

/// 윈도우 생성
#[tauri::command]
pub async fn open_window(app_handle: AppHandle, window_type: WindowType) -> Result<String, String> {
    let label = window_type.as_str();

    // 이미 존재하는 윈도우면 포커스
    if app_handle.get_webview_window(label).is_some() {
        return focus_window(app_handle, label.to_string()).await;
    }

    let (width, height) = window_type.size();

    WebviewWindowBuilder::new(
        &app_handle,
        label,
        WebviewUrl::App(window_type.url().into()),
    )
    .title(window_type.title())
    .inner_size(width, height)
    .center()
    .build()
    .map_err(|e| e.to_string())?;

    println!("✅ 윈도우 생성: {}", label);
    Ok("Window opened successfully".to_string())
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

/// 윈도우 전환 (기존 윈도우 닫고 새 윈도우 열기)
#[tauri::command]
pub async fn switch_window(
    app_handle: AppHandle,
    from_label: String,
    to_window_type: WindowType,
) -> Result<String, String> {
    // label을 미리 저장
    let to_label = to_window_type.as_str();

    // 기존 윈도우 닫기
    close_window(app_handle.clone(), from_label.clone()).await?;

    // 새 윈도우 열기
    open_window(app_handle, to_window_type).await?;

    println!("🔄 윈도우 전환: {} → {}", from_label, to_label);
    Ok("Window switched successfully".to_string())
}

/// 모든 윈도우 닫고 새 윈도우 열기
#[tauri::command]
pub async fn replace_all_windows(
    app_handle: AppHandle,
    window_type: WindowType,
) -> Result<String, String> {
    let new_label = window_type.as_str();

    // 모든 윈도우 닫기
    let windows: Vec<String> = app_handle
        .webview_windows()
        .keys()
        .map(|k| k.to_string())
        .collect();

    for label in windows {
        close_window(app_handle.clone(), label).await?;
    }

    // 새 윈도우 열기
    open_window(app_handle, window_type).await?;

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
