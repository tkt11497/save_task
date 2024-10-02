// Create an Axios instance
import axios from 'axios'
import {loadingStore, navStore, userStore} from "@/store/index.js";
import {storeToRefs} from "pinia";
import {closeToast, showToast} from "vant";
import router from "@/router/index.js";

const request = axios.create({
    baseURL: '/api',
    timeout: 1000 * 30,
    headers: {
        Authorization: '',
    },
})


// Add an interceptor to add the token to requests that need it
request.interceptors.request.use(
    (config) => {
        const usStore = userStore()
        const { userId } = storeToRefs(usStore)
        // const storageToken = localStorage.getItem('token')

        // 添加语言
        if (!config.params) {
            config.params = {}
        }
        config.params.lang = usStore.languageCode

        if (config.url !== '/user/login' && userId.value) {
            config.headers['Authorization'] = userId.value
        }
        return config
    },
    (error) => {
        console.log('接口请求失败', error)
        return Promise.reject(error)
    }
)

request.interceptors.response.use(
    (res) => {
        const userStoreObj = userStore()
        const navStoreObj = navStore()
        const loadingStoreObj = loadingStore()
        console.log(res)
        const status = res.data.code

        if (0 === status) {
            res.data.success = true
            return Promise.resolve(res.data)
        } else if (401 === status) {
            // todo 默认调用login
            console.log('请求401')
            userStoreObj.loginAction().then(()=>{
                console.log('请求401，重新登录成功')
                return request({
                    method: res.config.method,
                    url: res.config.url,
                    data: res.config.data,
                    params: res.config.params
                })
            }).then((apiData) => {
                console.log('请求401，重新请求成功', apiData)
                return Promise.resolve(apiData)
            }).catch(e => {
                console.log('请求401失败', e)
                loadingStoreObj.clearCount()
                closeToast()

                navStoreObj.SET_NAV_DATA(0)
                router.push('/noWallet')
                return Promise.reject(res.data)
            })
        } else {
            res.data.success = false

            if (res.data.code !== 500) {
                loadingStoreObj.subtractCount()
                showToast({
                    message: res.data.msg,
                    icon: 'info',
                })
            } else {
                loadingStoreObj.clearCount()
                // 关闭单例模式下，请求的loading
                closeToast()
            }
            // showToast({
            // 	message: status !== 500 && res.data.msg ? res.data.msg : i18n.global.t('错误提示.服务错误'),
            // 	icon: 'info',
            // })
            return Promise.reject(res.data)
        }
    },
    (error) => {
        console.log('接口返回失败', error)
        // showFailToast({
        // 	message: error.message || i18n.global.t('错误提示.网络错误'),
        // 	icon: 'info',
        // })
        return Promise.reject(error)
    }
)

export default request

