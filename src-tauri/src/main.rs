// C:\pilot-tauri\nexus-call-hub\src-tauri\src\main.rs
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

mod state;
mod window;

use state::auth_state::AuthState;

fn main() {
    tauri::Builder::default()
        .manage(AuthState::default()) // 🔐 AuthState 등록
        .invoke_handler(tauri::generate_handler![
            // 윈도우 관리
            window::commands::open_window,
            window::commands::close_window,
            window::commands::switch_window,
            window::commands::replace_all_windows,
            window::commands::focus_window,
            window::commands::window_exists,
            window::commands::hide_window,
            window::commands::show_window,
            window::commands::list_windows,
            window::commands::minimize_window,
            window::commands::maximize_window,
            window::commands::unmaximize_window,
            window::commands::resize_window,
            window::commands::move_window,
            window::commands::set_always_on_top,
            // 🔐 메인 인증 관리 함수들
            state::auth_state::set_user_state,
            state::auth_state::get_user_state,
            state::auth_state::logout_user,
            state::auth_state::is_authenticated,
            state::auth_state::check_permission,
            // 🔐 호환성 별칭들 (LoginComponent에서 사용)
            state::auth_state::login_user, // ✅ 이것이 누락되어 있었음
            state::auth_state::get_user_info,
            state::auth_state::get_user,
            state::auth_state::clear_user_info,
            state::auth_state::is_logged_in,
            // 🔐 추가 유틸리티들
            state::auth_state::get_user_role,
            state::auth_state::get_user_department,
            state::auth_state::validate_user_session,
            state::auth_state::increment_login_attempts,
            state::auth_state::get_login_attempts,
            state::auth_state::reset_login_attempts,
            state::auth_state::get_auth_state_debug, // ✅ 함수명 수정
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
