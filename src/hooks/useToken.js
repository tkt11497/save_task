import BigNumber from 'bignumber.js'
import { getAllPlatformTokenBalanceApi } from '@/apis/wallet.js'
import { useWeb3Store } from '@/store/index.js'
import { storeToRefs } from 'pinia'
import { getContract, getTokenBalance } from '@/utils/web3.js'
import { ref } from 'vue'

export function useToken() {
	const web3Store = useWeb3Store()
	const { address, configContractAddress } = storeToRefs(web3Store)

	// 查询过的币种、合约
	let currentContractTokenName
	let currentContractInstance
	// 获取链上指定币种余额
	const getChainBalanceByTokenName = async (checkedCurrency, callback) => {
		console.log('================getChainBalanceByTokenName begin============')
		console.log('useToken-当前选择币种：', checkedCurrency, callback)
		console.log('useToken-当前选择地址：', address.value)

		let balance = 0
		try {
			const config = await getPlatformTokenByCoinType(checkedCurrency)

			if (currentContractTokenName !== checkedCurrency) {
				currentContractInstance = getContract({
					contractAddress: configContractAddress.value,
					tokenName: checkedCurrency,
				})
			}

			const balance = await getTokenBalance({
				tokenName: checkedCurrency,
				contract: currentContractInstance,
				ownerAddress: address.value,
				balanceDecimals: config.decimals,
			})
			currentContractTokenName = checkedCurrency
			console.log('useToken-', `${checkedCurrency}代币余额:`, balance)
		} catch (e) {
			console.log('useToken-', `${checkedCurrency}获取链上余额失败`, e)
		}
		return balance
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

	return {
		getChainBalanceByTokenName,
		getPlatformTokenList,
		getPlatformTokenByCoinType,
	}
}
