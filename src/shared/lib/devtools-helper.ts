import { invoke } from '@tauri-apps/api/core';

/**
 * 개발자 도구 관리 유틸리티
 */
export class DevToolsHelper {
  /**
   * 키보드 이벤트로 개발자 도구 열기
   */
  static initKeyboardShortcuts() {
    document.addEventListener('keydown', async (event) => {
      // F12 키
      if (event.key === 'F12') {
        event.preventDefault();
        await this.tryOpenDevTools();
      }

      // Ctrl+Shift+I
      if (event.ctrlKey && event.shiftKey && event.key === 'I') {
        event.preventDefault();
        await this.tryOpenDevTools();
      }

      // Ctrl+Shift+J (콘솔)
      if (event.ctrlKey && event.shiftKey && event.key === 'J') {
        event.preventDefault();
        await this.tryOpenDevTools();
      }
    });
  }

  /**
   * 개발자 도구 열기 시도
   */
  static async tryOpenDevTools() {
    try {
      console.log('🛠️ 개발자 도구 열기 시도...');

      // 1. Tauri 명령어로 시도
      await invoke('open_current_devtools');

      // 2. 브라우저 API로 시도 (있다면)
      if (typeof window !== 'undefined' && (window as any).__TAURI__) {
        console.log('Tauri 환경에서 개발자 도구 열기');
      }

      // 3. 개발 모드에서는 직접 콘솔 열기
      if (import.meta.env.DEV) {
        console.log('개발 모드: 개발자 도구를 사용할 수 있습니다');
      }

      console.log('✅ 개발자 도구 열기 성공');
    } catch (error) {
      console.error('❌ 개발자 도구 열기 실패:', error);

      // 대안 방법 시도
      console.log('🔄 대안 방법으로 키보드 단축키를 사용해주세요: F12, Ctrl+Shift+I');
    }
  }

  /**
   * 개발자 도구 상태 확인
   */
  static async checkDevToolsAvailability() {
    try {
      const isAvailable = await invoke('open_devtools');
      console.log('개발자 도구 사용 가능:', isAvailable);
      return true;
    } catch (error) {
      console.error('개발자 도구 확인 실패:', error);
      return false;
    }
  }

  /**
   * 디버그 정보 출력
   */
  static printDebugInfo() {
    console.log('=== 개발자 도구 디버그 정보 ===');
    console.log('현재 환경:', import.meta.env.MODE);
    console.log('Tauri 사용 가능:', typeof window !== 'undefined' && (window as any).__TAURI__);
    console.log('User Agent:', navigator.userAgent);
    console.log('단축키: F12, Ctrl+Shift+I, Ctrl+Shift+J');
    console.log('==========================');
  }
}

// 자동 초기화
if (typeof window !== 'undefined') {
  // 페이지 로드 시 자동으로 단축키 등록
  document.addEventListener('DOMContentLoaded', () => {
    DevToolsHelper.initKeyboardShortcuts();
    DevToolsHelper.printDebugInfo();
  });

  // 전역 객체에 추가 (콘솔에서 테스트용)
  (window as any).DevToolsHelper = DevToolsHelper;
}

export default DevToolsHelper;
