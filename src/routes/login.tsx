// src/routes/login.tsx
import React, { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'  // createFileRoute 제거
import { Button } from '@/shared/ui/button'

function LoginPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // 임시 로그인 로직
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('로그인 시도:', formData)

      // 로그인 성공 후 홈으로 이동 (dashboard는 아직 없으니)
      alert('로그인 성공!')
      navigate({ to: '/' })

    } catch (error) {
      console.error('로그인 실패:', error)
      alert('로그인에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    navigate({ to: '/' })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">N</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Nexus Call Hub</h1>
              <p className="text-xs text-gray-500">로그인</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="text-gray-500 hover:text-gray-700"
          >
            ← 돌아가기
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-2xl">👤</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">로그인</h2>
              <p className="text-sm text-gray-600">상담사 계정으로 로그인하세요</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  사용자명
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="사용자명을 입력하세요"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  비밀번호
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="비밀번호를 입력하세요"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                  로그인 상태 유지
                </label>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    로그인 중...
                  </div>
                ) : (
                  '로그인'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                문제가 있으신가요?{' '}
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  관리자에게 문의
                </button>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4">
        <div className="bg-white border border-gray-200 rounded-lg p-3">
          <div className="flex items-center justify-center gap-6 text-xs text-gray-600">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span>시스템 정상</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              <span>서버 연결됨</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

// 이 부분이 중요! ✨
export default LoginPage

// 기존의 이 부분은 삭제:
// export const Route = createFileRoute('/login')({
//   component: LoginPage,
// })