import React from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Button } from '@/shared/ui/button';
import DevToolsHelper from '@/shared/lib/devtools-helper';

const DevToolsTestPanel: React.FC = () => {
    const handleOpenDevTools = async () => {
        try {
            await invoke('open_current_devtools');
            console.log('개발자 도구를 열었습니다.');
            alert('개발자 도구를 열었습니다!');
        } catch (error) {
            console.error('개발자 도구 열기 실패:', error);
            alert('개발자 도구 열기 실패: ' + error);
        }
    };

    const handleTestShortcuts = () => {
        DevToolsHelper.printDebugInfo();
        alert('콘솔을 확인하세요. F12, Ctrl+Shift+I, Ctrl+Shift+J를 시도해보세요.');
    };

    const handleCheckAvailability = async () => {
        const isAvailable = await DevToolsHelper.checkDevToolsAvailability();
        alert(`개발자 도구 사용 가능: ${isAvailable}`);
    };

    return (
        <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
            <h3 className="text-lg font-semibold mb-3 text-yellow-800">
                🛠️ 개발자 도구 테스트
            </h3>

            <div className="space-y-2">
                <Button
                    onClick={handleOpenDevTools}
                    variant="outline"
                    className="w-full"
                >
                    개발자 도구 열기 (Tauri 명령어)
                </Button>

                <Button
                    onClick={handleTestShortcuts}
                    variant="outline"
                    className="w-full"
                >
                    단축키 테스트 (F12, Ctrl+Shift+I)
                </Button>

                <Button
                    onClick={handleCheckAvailability}
                    variant="outline"
                    className="w-full"
                >
                    개발자 도구 사용 가능 여부 확인
                </Button>
            </div>

            <div className="mt-3 text-sm text-yellow-700">
                <p><strong>시도해볼 방법들:</strong></p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>F12 키 누르기</li>
                    <li>Ctrl + Shift + I</li>
                    <li>Ctrl + Shift + J (콘솔)</li>
                    <li>마우스 우클릭 → "검사" (있다면)</li>
                </ul>
            </div>
        </div>
    );
};

export default DevToolsTestPanel;
