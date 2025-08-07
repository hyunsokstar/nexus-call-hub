// C:\nexus-call-hub\src\widgets\SignupForm\SignupComponent.tsx
import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { signupApi } from '@/shared/api/auth'
import { SignupRequest } from '@/shared/api/types'
import { Button } from '@/shared/ui/button'

interface SignupComponentProps {
    onSignupSuccess: () => void
    onSwitchToLogin: () => void
}

function SignupComponent({ onSignupSuccess, onSwitchToLogin }: SignupComponentProps) {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: ''
    })
    const [errors, setErrors] = useState<Record<string, string>>({})

    // 🔥 회원가입 Mutation
    const signupMutation = useMutation({
        mutationFn: (data: SignupRequest) => signupApi(data),
        onSuccess: (response) => {
            console.log('✅ 회원가입 성공:', response)
            alert('회원가입이 완료되었습니다! 로그인해주세요.')
            onSignupSuccess()
        },
        onError: (error: any) => {
            console.error('❌ 회원가입 실패:', error)
            const errorMessage = error.response?.data?.message || '회원가입에 실패했습니다.'
            setErrors({ submit: errorMessage })
        }
    })

    // 폼 유효성 검사
    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.username.trim()) {
            newErrors.username = '사용자명을 입력해주세요'
        } else if (formData.username.length < 3) {
            newErrors.username = '사용자명은 3글자 이상이어야 합니다'
        }

        if (!formData.password) {
            newErrors.password = '비밀번호를 입력해주세요'
        } else if (formData.password.length < 6) {
            newErrors.password = '비밀번호는 6글자 이상이어야 합니다'
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = '비밀번호 확인을 입력해주세요'
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = '비밀번호가 일치하지 않습니다'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // 회원가입 처리
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!validateForm()) {
            return
        }

        // 백엔드에 맞춰서 username, password만 전송
        signupMutation.mutate({
            username: formData.username,
            password: formData.password
        })
    }

    // 입력 값 변경 처리
    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        // 해당 필드의 에러 클리어
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">회원가입</h1>
                    <p className="text-gray-600">새 계정을 만들어보세요</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* 사용자명 입력 */}
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                            사용자명
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={formData.username}
                            onChange={(e) => handleChange('username', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                errors.username ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="사용자명을 입력하세요"
                            disabled={signupMutation.isPending}
                        />
                        {errors.username && (
                            <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                        )}
                    </div>

                    {/* 비밀번호 입력 */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            비밀번호
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => handleChange('password', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                errors.password ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="비밀번호를 입력하세요"
                            disabled={signupMutation.isPending}
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                        )}
                    </div>

                    {/* 비밀번호 확인 */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                            비밀번호 확인
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => handleChange('confirmPassword', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="비밀번호를 다시 입력하세요"
                            disabled={signupMutation.isPending}
                        />
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                        )}
                    </div>

                    {/* 서버 에러 메시지 */}
                    {errors.submit && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-sm text-red-600">{errors.submit}</p>
                        </div>
                    )}

                    {/* 회원가입 버튼 */}
                    <Button
                        type="submit"
                        disabled={signupMutation.isPending}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {signupMutation.isPending ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                회원가입 중...
                            </div>
                        ) : (
                            '회원가입'
                        )}
                    </Button>

                    {/* 로그인 페이지로 이동 */}
                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            이미 계정이 있으신가요?{' '}
                            <button
                                type="button"
                                onClick={onSwitchToLogin}
                                className="font-medium text-blue-600 hover:text-blue-500"
                                disabled={signupMutation.isPending}
                            >
                                로그인하기
                            </button>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SignupComponent
