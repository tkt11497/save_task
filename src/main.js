// vant
import Vant, { setToastDefaultOptions } from 'vant'
import 'vant/lib/index.css'

// i18n
import i18n from './i18n'
// vue
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 移动端你适配
// import 'amfe-flexible'

// 全局样式
import './assets/main.css'

// 注册全局组件
import Nav from '@/components/Nav/index.vue'

// App引入
import App from './App.vue'

// 路由引入
import router from './router'

// 引入store
import store from '@/store'
import { IMAGE_URL } from '@/config/index.js'

setToastDefaultOptions({ position: 'top', className: 'toptoast', duration: 3000 })

// 注册App
const app = createApp(App)
app.component('Nav', Nav)
app.config.globalProperties.$imgpath = IMAGE_URL || ''
app.use(i18n)
app.use(ElementPlus)
app.use(store)
app.use(router)
app.use(Vant)
// Lazyload 指令需要单独进行注册
// app.use(vant.Lazyload);

app.mount('#app')
