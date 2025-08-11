// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use tauri::Manager;

mod window;
use window::commands::{
    close_window, focus_window, hide_window, maximize_window, minimize_window, move_window,
    open_window, replace_all_windows, resize_window, set_always_on_top, show_window, switch_window,
    unmaximize_window, window_close_devtools, window_exists, window_open_all_devtools,
    window_open_devtools,
};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            open_window,
            window_open_devtools,
            window_close_devtools,
            window_open_all_devtools,
            close_window,
            focus_window,
            window_exists,
            switch_window,
            replace_all_windows,
            hide_window,
            show_window,
            minimize_window,
            maximize_window,
            unmaximize_window,
            resize_window,
            move_window,
            set_always_on_top,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
