import axios from 'axios';

// 실제 백엔드 연동 시 baseURL 설정
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // 예시
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: JWT 토큰 자동 주입
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;