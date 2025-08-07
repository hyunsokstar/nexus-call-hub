// C:\pilot-tauri\nexus-call-hub\src\launcher\api\auth.ts

import { apiClient } from "./client"
import { ApiResponse, LoginRequest, LoginResponseData, UserInfo, SignupRequest, SignupResponseData } from "./types"

// 로그인 API
export const loginApi = async (credentials: LoginRequest): Promise<ApiResponse<LoginResponseData>> => {
    const response = await apiClient.post<ApiResponse<LoginResponseData>>('/auth/login', credentials)
    return response.data
}

// 회원가입 API
export const signupApi = async (userData: SignupRequest): Promise<ApiResponse<SignupResponseData>> => {
    const response = await apiClient.post<ApiResponse<SignupResponseData>>('/auth/signup', userData)
    return response.data
}

// 현재 사용자 정보 조회 API
export const getCurrentUserApi = async (token: string): Promise<ApiResponse<UserInfo>> => {
    const response = await apiClient.get<ApiResponse<UserInfo>>('/auth/me', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data
}

// 토큰 유효성 검증 API
export const validateTokenApi = async (token: string): Promise<ApiResponse> => {
    const response = await apiClient.post<ApiResponse>('/auth/validate', {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    return response.data
}