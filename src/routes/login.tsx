// src/routes/login.tsx
import React, { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { Checkbox } from '@/shared/ui/checkbox'
import { ArrowLeft, Loader2, Shield, Server, Wifi } from 'lucide-react'
import { cn } from '@/lib/utils'

function LoginPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

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
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log('로그인 시도:', formData)

      // 로그인 성공 후 대시보드로 이동
      navigate({ to: '/dashboard' })

    } catch (error) {
      console.error('로그인 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    navigate({ to: '/' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="relative bg-white/80 backdrop-blur-sm border-b border-slate-200/60 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-lg font-bold">N</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-xl font-semibold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Nexus Call Hub
              </h1>
              <p className="text-sm text-slate-500 font-medium">통합 상담 관리 시스템</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            돌아가기
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full max-w-md relative">
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="space-y-6 pb-8">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center shadow-inner">
                    <Shield className="w-10 h-10 text-blue-600" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="text-center space-y-2">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  상담사 로그인
                </CardTitle>
                <CardDescription className="text-slate-600">
                  보안 인증을 통해 상담 시스템에 접속하세요
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium text-slate-700">
                    사용자명
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="상담사 ID를 입력하세요"
                    className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-slate-700">
                    비밀번호
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="비밀번호를 입력하세요"
                    className="h-11 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <Label htmlFor="remember" className="text-sm text-slate-700 cursor-pointer">
                    로그인 상태 유지 (7일)
                  </Label>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
                    "text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      인증 중...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      보안 로그인
                    </div>
                  )}
                </Button>
              </form>

              <div className="text-center pt-4 border-t border-slate-100">
                <p className="text-sm text-slate-500">
                  로그인에 문제가 있으신가요?{' '}
                  <button className="text-blue-600 hover:text-blue-700 font-medium underline-offset-4 hover:underline transition-colors">
                    IT 지원팀 문의
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="p-6">
        <div className="max-w-md mx-auto">
          <Card className="bg-white/90 backdrop-blur-sm border-slate-200/60 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Server className="w-4 h-4 text-green-600" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-slate-700 font-medium">시스템 정상</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Wifi className="w-4 h-4 text-blue-600" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-slate-700 font-medium">네트워크 연결</span>
                </div>
              </div>
              <div className="text-center mt-3 pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  © 2024 Nexus Call Hub. 보안 연결로 보호됨
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </footer>
    </div>
  )
}

export default LoginPage