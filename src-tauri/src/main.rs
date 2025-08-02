// src-tauri/src/main.rs
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod window;

use window::{close_window, focus_window, open_window, window_exists};

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            open_window,
            close_window,
            focus_window,
            window_exists,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
