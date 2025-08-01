// // Prevents additional console window on Windows in release, DO NOT REMOVE!!
// #![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// // Tauri의 Manager 트레이트를 임포트 (앱 핸들 조작을 위해 필요)
// // tauri 의 Manager 트레이드 임포트후 마치 main.rs 의 함수인것처럼 app.handle()로 사용 할 수 있음
// use tauri::Manager;

// // 우리가 만든 window 모듈을 임포트 (src/window.rs 파일)
// mod window;

// // window 모듈에서 특정 함수와 타입들을 가져옴
// use window::{create_window, WindowType};

// fn main() {
//     // Tauri 앱 빌더 시작 (기본 설정으로)
//     tauri::Builder::default()
//         // 앱 초기 설정 단계 (앱이 시작될 때 한 번만 실행됨)
//         .setup(|app| {
//             create_window(app.handle(), WindowType::Launcher)?;

//             // setup 함수가 성공적으로 완료되었음을 나타냄
//             Ok(())
//         })
//         // Tauri 앱 실행 시작 (이벤트 루프 시작)
//         .run(tauri::generate_context!())
//         // 앱 실행 중 치명적 에러 발생시 패닉과 함께 종료
//         .expect("error while running tauri application");
// }

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Tauri의 Manager 트레이트를 임포트 (앱 핸들 조작을 위해 필요)
use tauri::Manager;

// 우리가 만든 window 모듈을 임포트 (src/window.rs 파일)
mod window;

// window 모듈에서 특정 함수와 타입들을 가져옴
use window::{create_window, WindowType};

fn main() {
    // Tauri 앱 빌더 시작 (기본 설정으로)
    tauri::Builder::default()
        // 앱 초기 설정 단계 (앱이 시작될 때 한 번만 실행됨)
        .setup(|app| {
            // 🆕 기본 윈도우("main") 닫기
            if let Some(main_window) = app.get_webview_window("main") {
                let _ = main_window.close();
            }

            // 🆕 런처 윈도우만 생성
            create_window(app.handle(), WindowType::Launcher)?;

            // setup 함수가 성공적으로 완료되었음을 나타냄
            Ok(())
        })
        // Tauri 앱 실행 시작 (이벤트 루프 시작)
        .run(tauri::generate_context!())
        // 앱 실행 중 치명적 에러 발생시 패닉과 함께 종료
        .expect("error while running tauri application");
}
