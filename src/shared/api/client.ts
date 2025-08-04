// C:\pilot-tauri\nexus-call-hub\src\launcher\api\client.ts
import axios from 'axios'

// API 베이스 설정
export const apiClient = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/json; charset=utf-8',
    },
    timeout: 10000, // 10초 타임아웃
})

// 요청 인터셉터 (토큰 자동 추가)
apiClient.interceptors.request.use(
    (config) => {
        // 추후 토큰이 필요한 요청에 자동으로 토큰 추가
        // const token = getStoredToken()
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`
        // }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// 응답 인터셉터 (에러 처리)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // 401 에러 시 로그아웃 처리 등
        if (error.response?.status === 401) {
            console.log('인증 에러 - 로그아웃 필요')
        }
        return Promise.reject(error)
    }
)