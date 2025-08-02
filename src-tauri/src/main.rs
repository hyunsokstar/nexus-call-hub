// src-tauri/src/main.rs
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod window;

use window::*; // 모든 윈도우 함수들을 한번에 import

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            open_window,
            close_window,
            focus_window,
            window_exists,
            switch_window,
            replace_all_windows,
            hide_window,
            show_window,
            list_windows,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
