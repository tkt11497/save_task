import { ref } from 'vue'
import BigNumber from 'bignumber.js'
import { useLocalStorage } from '@vueuse/core'
import { getAllPlatformTokenBalanceApi, getSingleChainTokenBalanceApi } from '@/apis/wallet.js'
import { useWeb3Store } from '@/store/index.js'
import { storeToRefs } from 'pinia'

export function useToken() {
	const web3Store = useWeb3Store()
	const { address } = storeToRefs(web3Store)
	// 账户余额
	let balance = ref(0)

	const tokenClientList = useLocalStorage('tokenClientList', [])

	const getBalance = async (checkedCurrency, callback) => {
		console.log('================getBalance begin============')
		await web3Store.initWallet()

		console.log('useToken-当前选择币种：', checkedCurrency, callback)
		console.log('useToken-当前选择地址：', address.value)

		try {
			const config = await getPlatformTokenByCoinType(checkedCurrency)
			const decimals = config.decimals || 6 // 默认精度为 6，如果 config.decimals 没有定义
			const divisor = new BigNumber(10).pow(decimals)
			balance.value = new BigNumber(config.balance).dividedBy(divisor).toFixed(decimals)
			console.log(`useToken-${checkedCurrency}代币余额:`, balance.value)
			callback && callback(balance.value)
		} catch (e) {
			callback && callback()
			console.log('useToken', '获取余额失败', e)
		}
	}

	// 获取币种配置列表====平台所有币种余额
	const getPlatformTokenList = async () => {
		try {
			let tokenRes = await getAllPlatformTokenBalanceApi()
			tokenClientList.value = tokenRes.data?.tokenList || []
			console.log('useToken', '获取平台所有币种余额', tokenClientList.value)
		} catch (e) {
			console.log('useToken', '获取平台所有币种余额失败', e)
		}
	}

	// 获取指定币种配置信息====平台指定币种余额
	const getPlatformTokenByCoinType = async (checkedCurrency) => {
		try {
			const res = await getSingleChainTokenBalanceApi(checkedCurrency)
			console.log('useToken', `获取平台【${checkedCurrency}】余额`, res.data)
			return res.data
		} catch (e) {
			console.log('useToken', `获取平台【${checkedCurrency}】余额失败`, e)
		}
	}

	return {
		balance,
		getBalance,
		tokenClientList,
		getPlatformTokenList,
		getPlatformTokenByCoinType,
	}
}
