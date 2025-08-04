import { Button } from './Button'
import { Plus, Download, Trash2, Check, Save, Settings } from 'lucide-react'

export const ButtonShowcase = () => {
  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Button Component Test</h1>
        
        {/* 기본 변형들 */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">기본 스타일</h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="default">Default</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </section>

        {/* 컬러 변형들 */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">컬러 변형</h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="success" icon={<Check size={16} />}>Success</Button>
            <Button variant="warning">Warning</Button>
            <Button variant="destructive" icon={<Trash2 size={16} />}>Destructive</Button>
          </div>
        </section>

        {/* 크기 변형들 */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">크기 변형</h2>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" size="sm">Small</Button>
            <Button variant="outline" size="default">Default</Button>
            <Button variant="outline" size="lg">Large</Button>
          </div>
        </section>

        {/* 실제 사용 예시 */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">실제 사용 예시</h2>
          <div className="bg-white p-6 rounded-lg border space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">콜봇 관리</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">취소</Button>
                <Button variant="default" size="sm" icon={<Save size={14} />}>저장</Button>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button variant="success" icon={<Plus size={16} />}>
                새 콜봇 생성
              </Button>
              <Button variant="outline" icon={<Settings size={16} />}>
                설정
              </Button>
              <Button variant="outline" icon={<Download size={16} />}>
                내보내기
              </Button>
            </div>
            
            <div className="pt-4 border-t flex justify-end gap-2">
              <Button variant="ghost">이전</Button>
              <Button variant="default">다음</Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
