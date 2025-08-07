// C:\pilot-tauri\nexus-call-hub\src\launcher\api\client.ts
import axios from 'axios'

// 환경별 API 서버 설정
const getApiBaseUrl = () => {
    // 개발 환경 체크 (Vite 개발 서버)
    if (import.meta.env.DEV) {
        console.log('🔧 개발 환경 - 로컬 Spring Boot 서버 사용');
        return 'http://localhost:8080';
    }

    // Tauri 앱 환경 체크
    if (typeof window !== 'undefined' && (window as any).__TAURI__) {
        console.log('📱 Tauri 앱 환경 - EC2 서버 사용');
        return 'http://43.200.234.52:8080';
    }

    // 기본값 (브라우저에서 빌드된 것)
    console.log('🌐 브라우저 환경 - EC2 서버 사용');
    return 'http://43.200.234.52:8080';
};

// API 베이스 설정
export const apiClient = axios.create({
    baseURL: getApiBaseUrl(),
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