// C:\pilot-tauri\nexus-call-hub\src-tauri\src\state\auth_state.rs
use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri::{AppHandle, Emitter};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub id: String,
    pub name: String,
    pub department: String,
    pub role: String,
    pub token: String,
}

// 인증 관련 상태만 관리
#[derive(Default)]
pub struct AuthState {
    pub user: Mutex<Option<User>>,
    pub is_authenticated: Mutex<bool>,
    pub login_attempts: Mutex<u32>,
    pub last_login: Mutex<Option<String>>, // ISO timestamp
}

// === 인증 관련 Tauri Commands ===

#[tauri::command]
pub fn login_user(
    app: AppHandle,
    state: tauri::State<AuthState>,
    user: User,
) -> Result<(), String> {
    // 1. 인증 상태 업데이트
    *state.user.lock().unwrap() = Some(user.clone());
    *state.is_authenticated.lock().unwrap() = true;
    *state.last_login.lock().unwrap() = Some(chrono::Utc::now().to_rfc3339());
    *state.login_attempts.lock().unwrap() = 0; // 성공 시 시도 횟수 리셋

    // 2. 모든 윈도우에 로그인 이벤트 발송
    app.emit("user-logged-in", &user)
        .map_err(|e| e.to_string())?;

    println!("✅ [AUTH] 사용자 로그인: {} ({})", user.name, user.role);
    Ok(())
}

#[tauri::command]
pub fn get_user(state: tauri::State<AuthState>) -> Option<User> {
    state.user.lock().unwrap().clone()
}

#[tauri::command]
pub fn logout_user(app: AppHandle, state: tauri::State<AuthState>) -> Result<(), String> {
    // 1. 현재 사용자 정보 백업 (로그용)
    let user_info = state
        .user
        .lock()
        .unwrap()
        .as_ref()
        .map(|u| format!("{} ({})", u.name, u.role))
        .unwrap_or_else(|| "Unknown User".to_string());

    // 2. 인증 상태 초기화
    *state.user.lock().unwrap() = None;
    *state.is_authenticated.lock().unwrap() = false;

    // 3. 모든 윈도우에 로그아웃 이벤트 발송
    app.emit("user-logged-out", ()).map_err(|e| e.to_string())?;

    println!("✅ [AUTH] 사용자 로그아웃: {}", user_info);
    Ok(())
}

#[tauri::command]
pub fn is_authenticated(state: tauri::State<AuthState>) -> bool {
    *state.is_authenticated.lock().unwrap()
}

#[tauri::command]
pub fn get_user_role(state: tauri::State<AuthState>) -> Option<String> {
    state.user.lock().unwrap().as_ref().map(|u| u.role.clone())
}

#[tauri::command]
pub fn get_user_department(state: tauri::State<AuthState>) -> Option<String> {
    state
        .user
        .lock()
        .unwrap()
        .as_ref()
        .map(|u| u.department.clone())
}

#[tauri::command]
pub fn increment_login_attempts(state: tauri::State<AuthState>) -> u32 {
    let mut attempts = state.login_attempts.lock().unwrap();
    *attempts += 1;
    *attempts
}

#[tauri::command]
pub fn get_login_attempts(state: tauri::State<AuthState>) -> u32 {
    *state.login_attempts.lock().unwrap()
}

#[tauri::command]
pub fn reset_login_attempts(state: tauri::State<AuthState>) -> Result<(), String> {
    *state.login_attempts.lock().unwrap() = 0;
    println!("🔄 [AUTH] 로그인 시도 횟수 리셋");
    Ok(())
}

// 사용자 토큰 유효성 검증 (프론트엔드에서 호출용)
#[tauri::command]
pub fn validate_user_session(state: tauri::State<AuthState>) -> bool {
    let user = state.user.lock().unwrap();
    let is_auth = *state.is_authenticated.lock().unwrap();

    // 사용자 정보와 인증 상태가 모두 있어야 유효한 세션
    user.is_some() && is_auth
}

// 현재 인증 상태 전체 조회 (디버깅용)
#[tauri::command]
pub fn get_auth_state_debug(state: tauri::State<AuthState>) -> serde_json::Value {
    let user = state.user.lock().unwrap().clone();
    let is_authenticated = *state.is_authenticated.lock().unwrap();
    let login_attempts = *state.login_attempts.lock().unwrap();
    let last_login = state.last_login.lock().unwrap().clone();

    serde_json::json!({
        "user": user,
        "is_authenticated": is_authenticated,
        "login_attempts": login_attempts,
        "last_login": last_login,
        "has_valid_session": user.is_some() && is_authenticated
    })
}
