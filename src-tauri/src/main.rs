// C:\pilot-tauri\nexus-call-hub\src-tauri\src\main.rs
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod state;
mod window;

use state::*;
use window::*;

fn main() {
    tauri::Builder::default()
        // State 등록 - Rust식 Zustand! 🦀
        .manage(AuthState::default())
        .manage(QueueState::default())
        // Commands 등록
        .invoke_handler(tauri::generate_handler![
            // === 윈도우 관리 ===
            open_window,
            close_window,
            focus_window,
            window_exists,
            switch_window,
            replace_all_windows,
            hide_window,
            show_window,
            list_windows,
            // === 인증 관리 ===
            login_user,
            get_user,
            logout_user,
            is_authenticated,
            get_user_role,
            get_user_department,
            increment_login_attempts,
            get_login_attempts,
            reset_login_attempts,
            validate_user_session,
            get_auth_state_debug,
            // === 대기열 관리 ===
            update_queue_status,
            get_queue_status,
            update_agent_status,
            get_all_agents,
            get_available_agents,
            get_busy_agents,
            get_queue_statistics,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
