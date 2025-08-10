import React from 'react';

const PersonalSchedulePage: React.FC = () => {
    return (
        <div className="flex h-full">
            {/* 왼쪽: 입력 폼 */}
            <div className="w-1/3 p-4 border-r bg-white">
                <h2 className="font-bold mb-2">개인 일정 입력</h2>
                {/* ...폼 요소들... */}
            </div>
            {/* 오른쪽: 데이터 목록 */}
            <div className="flex-1 p-4 bg-gray-50">
                <h2 className="font-bold mb-2">개인 일정 목록</h2>
                {/* ...리스트 요소들... */}
            </div>
        </div>
    );
};

export default PersonalSchedulePage;