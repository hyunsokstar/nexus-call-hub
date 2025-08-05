// C:\pilot-tauri\nexus-call-hub\src-tauri\src\state\auth_state.rs
use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri::{AppHandle, Emitter};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub id: String,
    pub name: String,
    pub email: Option<String>,
    pub department: String,
    pub role: String,
    pub token: String,
    pub permissions: Option<Vec<String>>,
}

#[derive(Default)]
pub struct AuthState {
    pub user: Mutex<Option<User>>,
    pub is_authenticated: Mutex<bool>,
}

// === 핵심 인증 함수들만 유지 ===

// 🔐 사용자 상태 설정 (로그인)
#[tauri::command]
pub fn set_user_state(
    app: AppHandle,
    state: tauri::State<AuthState>,
    user: User,
) -> Result<(), String> {
    *state.user.lock().unwrap() = Some(user.clone());
    *state.is_authenticated.lock().unwrap() = true;

    // 모든 윈도우에 로그인 이벤트 발송
    let _ = app.emit("user-logged-in", &user);

    println!("✅ [AUTH] 로그인: {} ({})", user.name, user.role);
    Ok(())
}

// 🔐 사용자 정보 조회
#[tauri::command]
pub fn get_user_state(state: tauri::State<AuthState>) -> Option<User> {
    state.user.lock().unwrap().clone()
}

// 🔐 로그아웃
#[tauri::command]
pub fn logout_user(app: AppHandle, state: tauri::State<AuthState>) -> Result<(), String> {
    let user_name = state
        .user
        .lock()
        .unwrap()
        .as_ref()
        .map(|u| u.name.clone())
        .unwrap_or_else(|| "Unknown".to_string());

    *state.user.lock().unwrap() = None;
    *state.is_authenticated.lock().unwrap() = false;

    // 모든 윈도우에 로그아웃 이벤트 발송
    let _ = app.emit("user-logged-out", ());

    println!("✅ [AUTH] 로그아웃: {}", user_name);
    Ok(())
}

// 🔐 인증 상태 확인
#[tauri::command]
pub fn is_authenticated(state: tauri::State<AuthState>) -> bool {
    let is_auth = *state.is_authenticated.lock().unwrap();
    let has_user = state.user.lock().unwrap().is_some();
    is_auth && has_user
}

// 🔐 권한 확인
#[tauri::command]
pub fn check_permission(state: tauri::State<AuthState>, permission: String) -> bool {
    if let Some(user) = state.user.lock().unwrap().as_ref() {
        if let Some(permissions) = &user.permissions {
            permissions.contains(&permission)
        } else {
            false
        }
    } else {
        false
    }
}

// === 호환성을 위한 별칭들 (기존 코드가 사용) ===

#[tauri::command]
pub fn login_user(
    app: AppHandle,
    state: tauri::State<AuthState>,
    user: User,
) -> Result<(), String> {
    set_user_state(app, state, user)
}

#[tauri::command]
pub fn get_user(state: tauri::State<AuthState>) -> Option<User> {
    get_user_state(state)
}

#[tauri::command]
pub fn is_logged_in(state: tauri::State<AuthState>) -> bool {
    is_authenticated(state)
}

// 🔍 디버깅 전용 (개발 중에만 사용)
#[tauri::command]
pub fn get_auth_debug_info(state: tauri::State<AuthState>) -> serde_json::Value {
    let user = state.user.lock().unwrap().clone();
    let is_authenticated = *state.is_authenticated.lock().unwrap();

    serde_json::json!({
        "user": user,
        "is_authenticated": is_authenticated,
        "has_valid_session": user.is_some() && is_authenticated
    })
}
