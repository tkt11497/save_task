import { getAllPlatformTokenBalanceApi, getSingleChainTokenBalanceApi } from '@/apis/wallet.js'
import { useWeb3Store } from '@/store/index.js'
import { storeToRefs } from 'pinia'
import { getContract, getTokenBalance } from '@/utils/web3.js'
import { ref } from 'vue'
import { toFixedDecimal } from '@/utils/index.js'

// 保存需要token的合约对象
let tokenContractCacheList = {}
export function useToken() {
	const web3Store = useWeb3Store()
	const { address } = storeToRefs(web3Store)

	// 获取链上指定币种余额 - 钱包获取
	const getChainBalanceByTokenNameForWallet = async (checkedCurrency) => {
		console.log('================getChainBalanceByTokenName begin============')
		console.log('useToken-当前选择币种：', checkedCurrency)
		console.log('useToken-当前选择地址：', address.value)

		let tokenContractCache = tokenContractCacheList[checkedCurrency]

		try {
			const config = await getPlatformTokenByCoinType(checkedCurrency)

			if (!tokenContractCache || tokenContractCache.contractInstance) {
				tokenContractCache = {
					tokenName: checkedCurrency,
					contractInstance: null,
					balance: toFixedDecimal(0, config.decimals),
				}
				tokenContractCache.contractInstance = getContract({
					contractAddress: config.contractAddress,
					tokenName: checkedCurrency,
				})

				tokenContractCacheList[checkedCurrency] = tokenContractCache
			}

			const balance = await getTokenBalance({
				tokenName: checkedCurrency,
				contract: tokenContractCache.contractInstance,
				ownerAddress: address.value,
				balanceDecimals: config.decimals,
			})

			tokenContractCache.balance = balance
			console.log('useToken-', `${checkedCurrency}代币余额:`, balance)
			return balance
		} catch (e) {
			console.error('useToken-', `${checkedCurrency}获取链上余额失败`, e)
			return tokenContractCache?.balance || 0
		}
	}

	// 获取链上指定币种余额 - 接口获取
	const getChainBalanceByTokenName = async (checkedCurrency) => {
		try {
			const res = await getSingleChainTokenBalanceApi(checkedCurrency)
			console.log('useToken-', `${checkedCurrency}代币余额:`, res.data?.balance)
			return res.data?.balance || 0
		} catch (e) {
			console.error('useToken-', `${checkedCurrency}获取链上余额失败`, e)
			return 0
		}
	}

	// 获取币种配置列表====平台所有币种余额
	const tokenClientList = ref([])
	const getPlatformTokenList = async () => {
		try {
			let tokenRes = await getAllPlatformTokenBalanceApi()
			tokenClientList.value = tokenRes.data || []
			console.log('useToken-', '获取平台所有币种信息', tokenClientList.value)
			return tokenClientList.value
		} catch (e) {
			console.log('useToken-', '获取平台所有币种信息失败', e)
		}
	}

	// 获取指定币种配置信息====平台指定币种余额
	const getPlatformTokenByCoinType = async (checkedCurrency, isForceRefresh) => {
		try {
			if (isForceRefresh || !tokenClientList.value.length) {
				await getPlatformTokenList()
			}
			const tokenData = tokenClientList.value.find((d) => d.tokenName === checkedCurrency)
			console.log('useToken-', `获取平台【${checkedCurrency}】信息`, tokenData)
			return tokenData
		} catch (e) {
			console.log('useToken-', `获取平台【${checkedCurrency}】余额信息`, e)
		}
	}

	const resetContracts = () => {
		tokenContractCacheList = {}
	}

	return {
		getChainBalanceByTokenName,
		getPlatformTokenList,
		getPlatformTokenByCoinType,
		resetContracts,
	}
}
