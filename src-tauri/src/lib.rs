// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use tauri::Manager;

mod devtools;
mod state;
mod window;

use state::auth_state::AuthState;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(AuthState::default())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            // 🛠️ 개발자 도구 관리 (단순화된 방식)
            devtools::open_devtools,
            devtools::close_devtools,
            devtools::toggle_devtools,
            devtools::open_current_devtools,
            devtools::close_current_devtools,
            devtools::is_devtools_open,
            devtools::is_dev_mode,
            devtools::get_devtools_shortcuts,
            // 윈도우 관리 (devtools 안내)
            window::commands::window_open_devtools,
            window::commands::window_close_devtools,
            window::commands::window_open_all_devtools,
            // 윈도우 관리
            window::commands::open_window,
            window::commands::close_window,
            window::commands::switch_window,
            window::commands::replace_all_windows,
            window::commands::focus_window,
            window::commands::window_exists,
            window::commands::hide_window,
            window::commands::show_window,
            window::commands::minimize_window,
            window::commands::maximize_window,
            window::commands::unmaximize_window,
            window::commands::resize_window,
            window::commands::move_window,
            window::commands::set_always_on_top,
            // 🔐 핵심 인증 함수들
            state::auth_state::set_user_state,
            state::auth_state::get_user_state,
            state::auth_state::logout_user,
            state::auth_state::is_authenticated,
            state::auth_state::check_permission,
            // 🔐 호환성 별칭들
            state::auth_state::login_user,
            state::auth_state::get_user,
            state::auth_state::is_logged_in,
            // 🔍 디버깅 (개발용)
            state::auth_state::get_auth_debug_info,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
