import { invoke } from '@tauri-apps/api/core';

/**
 * 개발자 도구 관련 유틸리티 함수들
 */
export class DevToolsManager {
  /**
   * 현재 윈도우의 개발자 도구 열기
   */
  static async openDevTools(): Promise<void> {
    try {
      await invoke('open_devtools');
      console.log('개발자 도구를 열었습니다.');
    } catch (error) {
      console.error('개발자 도구 열기 실패:', error);
    }
  }

  /**
   * 현재 윈도우의 개발자 도구 닫기
   */
  static async closeDevTools(): Promise<void> {
    try {
      await invoke('close_devtools');
      console.log('개발자 도구를 닫았습니다.');
    } catch (error) {
      console.error('개발자 도구 닫기 실패:', error);
    }
  }

  /**
   * 개발자 도구 토글 (열려있으면 닫고, 닫혀있으면 열기)
   */
  static async toggleDevTools(): Promise<boolean> {
    try {
      const isOpen = await invoke<boolean>('toggle_devtools');
      console.log(`개발자 도구 ${isOpen ? '열림' : '닫힘'}`);
      return isOpen;
    } catch (error) {
      console.error('개발자 도구 토글 실패:', error);
      return false;
    }
  }

  /**
   * 개발자 도구가 열려있는지 확인
   */
  static async isDevToolsOpen(): Promise<boolean> {
    try {
      return await invoke<boolean>('is_devtools_open');
    } catch (error) {
      console.error('개발자 도구 상태 확인 실패:', error);
      return false;
    }
  }

  /**
   * 특정 윈도우의 개발자 도구 열기
   */
  static async openDevToolsForWindow(windowLabel: string): Promise<void> {
    try {
      await invoke('open_devtools_for_window', { label: windowLabel });
      console.log(`윈도우 '${windowLabel}'의 개발자 도구를 열었습니다.`);
    } catch (error) {
      console.error(`윈도우 '${windowLabel}' 개발자 도구 열기 실패:`, error);
    }
  }

  /**
   * 모든 윈도우의 개발자 도구 열기
   */
  static async openDevToolsAll(): Promise<void> {
    try {
      await invoke('open_devtools_all');
      console.log('모든 윈도우의 개발자 도구를 열었습니다.');
    } catch (error) {
      console.error('모든 윈도우 개발자 도구 열기 실패:', error);
    }
  }

  /**
   * 콘솔에 로그 메시지 출력
   */
  static async logToConsole(message: string): Promise<void> {
    try {
      await invoke('log_to_console', { message });
    } catch (error) {
      console.error('콘솔 로그 출력 실패:', error);
    }
  }

  /**
   * 개발 모드인지 확인
   */
  static async isDevMode(): Promise<boolean> {
    try {
      return await invoke<boolean>('is_dev_mode');
    } catch (error) {
      console.error('개발 모드 확인 실패:', error);
      return false;
    }
  }

  /**
   * 개발자 도구 단축키 정보 가져오기
   */
  static async getDevToolsShortcuts(): Promise<string[]> {
    try {
      return await invoke<string[]>('get_devtools_shortcuts');
    } catch (error) {
      console.error('개발자 도구 단축키 정보 가져오기 실패:', error);
      return [];
    }
  }

  /**
   * 개발자 도구 초기화 (페이지 로드 시 호출)
   */
  static async initialize(): Promise<void> {
    // F12 키 이벤트 리스너 추가
    document.addEventListener('keydown', (event) => {
      if (event.key === 'F12') {
        event.preventDefault();
        this.toggleDevTools();
      }
      // Ctrl+Shift+I
      if (event.ctrlKey && event.shiftKey && event.key === 'I') {
        event.preventDefault();
        this.openDevTools();
      }
    });

    // 개발 모드 상태 로깅
    const isDevMode = await this.isDevMode();
    console.log(`현재 모드: ${isDevMode ? '개발' : '프로덕션'}`);

    // 단축키 정보 로깅
    const shortcuts = await this.getDevToolsShortcuts();
    console.log('개발자 도구 단축키:', shortcuts);
  }
}

// 전역 윈도우 객체에 DevToolsManager 추가 (디버깅용)
if (typeof window !== 'undefined') {
  (window as any).DevToolsManager = DevToolsManager;
}

export default DevToolsManager;
