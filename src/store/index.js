import { createPinia } from 'pinia'

//对pinia的数据进行持久化储存
import piniaPersist from 'pinia-plugin-persist'

//统一导入所有pinia仓库
import navStore from './modules/nav'
import userStore from './modules/user'
import loadingStore from './modules/loading'
import authStore from './modules/auth.js'
import useWeb3accountStroe from './modules/web3account'

export * from './modules/web3.js'

export { authStore, navStore, userStore, useWeb3accountStroe, loadingStore }

// 注册并使用pinia并把pinia导出

const store = createPinia()
store.use(piniaPersist)
export default store
