import request from '@/utils/request.js'

// 获取最新消息
export const fetchLatestNoticeApi = () => {
    return request.get('/notice/new')
}