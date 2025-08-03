// C:\pilot-tauri\nexus-call-hub\src\launcher\api\types.ts

// 공통 API 응답 타입
export interface ApiResponse<T = any> {
    success: boolean
    message: string
    data?: T
}

// 로그인 요청 타입
export interface LoginRequest {
    username: string
    password: string
}

// 로그인 응답 데이터 타입
export interface LoginResponseData {
    username: string
    message: string
    token: string
    tokenType: string
}

// 사용자 정보 타입
export interface UserInfo {
    id: number
    username: string
    name: string
    department: string
    role: string
}

// Tauri State용 사용자 타입
export interface User {
    id: string
    name: string
    department: string
    role: string
    token: string
}