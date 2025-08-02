// C:\pilot-tauri\nexus-call-hub\src\statistics\StatisticsApp.tsx
import { invoke } from "@tauri-apps/api/core"
import { Button } from "@/shared/ui/button"

function StatisticsApp() {
    const handleClose = async () => {
        try {
            await invoke('close_window', { label: 'statistics' })
        } catch (error) {
            console.error("윈도우 닫기 실패:", error)
        }
    }

    // 샘플 데이터
    const stats = {
        todayCalls: 23,
        totalDuration: "2시간 15분",
        avgDuration: "5분 52초",
        successRate: 89.5
    }

    const recentCalls = [
        { time: "14:32", duration: "3분 45초", status: "완료", number: "010-1234-5678" },
        { time: "14:15", duration: "7분 12초", status: "완료", number: "010-2345-6789" },
        { time: "13:58", duration: "2분 33초", status: "실패", number: "010-3456-7890" },
        { time: "13:42", duration: "8분 20초", status: "완료", number: "010-4567-8901" },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm font-bold">📊</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-gray-900">통화 통계</h1>
                            <p className="text-xs text-gray-500">오늘 ({new Date().toLocaleDateString()})</p>
                        </div>
                    </div>
                    <Button
                        onClick={handleClose}
                        variant="outline"
                        className="text-sm px-3 py-1"
                    >
                        닫기
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="p-6">
                {/* 통계 카드들 */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                                📞
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">오늘 통화</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.todayCalls}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                                ⏱️
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">총 통화시간</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalDuration}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                                📊
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">평균 통화시간</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.avgDuration}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                                ✅
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">성공률</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.successRate}%</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 최근 통화 목록 */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">최근 통화</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        시간
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        번호
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        통화시간
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        상태
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {recentCalls.map((call, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {call.time}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {call.number}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {call.duration}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${call.status === '완료'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}>
                                                {call.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default StatisticsApp