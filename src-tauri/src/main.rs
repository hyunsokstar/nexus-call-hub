// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Tauri의 Manager 트레이트를 임포트 (앱 핸들 조작을 위해 필요)
use tauri::Manager;

// 우리가 만든 window 모듈을 임포트 (src/window.rs 파일)
mod window;

// window 모듈에서 필요한 구조체와 함수들을 가져옴
use window::{WindowManager, WindowType};

fn main() {
    // Tauri 앱 빌더 시작 (기본 설정으로)
    tauri::Builder::default()
        // 🆕 Tauri 명령어들 등록 (프론트엔드에서 호출 가능)
        .invoke_handler(tauri::generate_handler![
            window::open_window,
            window::close_window_cmd,
            window::focus_window_cmd,
            window::list_windows_cmd,
            window::window_exists_cmd,
        ])
        // 앱 초기 설정 단계 (앱이 시작될 때 한 번만 실행됨)
        .setup(|app| {
            println!("🚀 Nexus Call Hub 시작 중...");

            // 기본 윈도우("main") 닫기 (Tauri가 자동으로 생성하는 윈도우)
            if let Some(main_window) = app.get_webview_window("main") {
                println!("❌ 기본 윈도우 닫는 중...");
                let _ = main_window.close();
            }

            // 런처 윈도우 생성
            match WindowManager::create_window(app.handle(), WindowType::Launcher) {
                Ok(_) => println!("✅ 런처 윈도우 생성 완료"),
                Err(e) => {
                    eprintln!("❌ 런처 윈도우 생성 실패: {}", e);
                    return Err(e.into());
                }
            }

            println!("🎉 Nexus Call Hub 초기화 완료!");

            // setup 함수가 성공적으로 완료되었음을 나타냄
            Ok(())
        })
        // 앱 종료 이벤트 처리
        .on_window_event(|window, event| {
            match event {
                tauri::WindowEvent::CloseRequested { .. } => {
                    println!("🔒 윈도우 닫힘: {}", window.label());

                    // 런처 윈도우가 닫히면 앱 전체 종료
                    if window.label() == "launcher" {
                        println!("🛑 런처 윈도우 닫힘 - 앱 종료");
                        std::process::exit(0);
                    }
                }
                tauri::WindowEvent::Focused(is_focused) => {
                    if *is_focused {
                        println!("🎯 윈도우 포커스: {}", window.label());
                    }
                }
                _ => {}
            }
        })
        // Tauri 앱 실행 시작 (이벤트 루프 시작)
        .run(tauri::generate_context!())
        // 앱 실행 중 치명적 에러 발생시 패닉과 함께 종료
        .expect("❌ Tauri 앱 실행 중 오류 발생");
}
