import { ref } from 'vue'
import BigNumber from 'bignumber.js'
import { AAVE_ABI, BNB_ABI, DAI_ABI, RENBTC_ABI, STETH_ABI, STKAAVE_ABI, UNI_ABI, USDC_ABI, XAUT_ABI } from '@/config/abi.js'
import { useLocalStorage } from '@vueuse/core'
import { getAllChainTokenBalanceApi, getSingleChainTokenBalanceApi } from '@/apis/wallet.js'
import { useWeb3Store } from '@/store/index.js'
import { storeToRefs } from 'pinia'

const ERC20_ABI = [
	// 授权某地址消费用户代币的方法
	{
		'constant': false,
		'inputs': [
			{
				'name': '_spender',
				'type': 'address',
			},
			{
				'name': '_value',
				'type': 'uint256',
			},
		],
		'name': 'approve',
		'outputs': [
			{
				'name': '',
				'type': 'bool',
			},
		],
		'type': 'function',
	},
	// 查询某地址的授权额度
	{
		'constant': true,
		'inputs': [
			{
				'name': '_owner',
				'type': 'address',
			},
			{
				'name': '_spender',
				'type': 'address',
			},
		],
		'name': 'allowance',
		'outputs': [
			{
				'name': '',
				'type': 'uint256',
			},
		],
		'type': 'function',
	},
	{
		'constant': true,
		'inputs': [{ 'name': 'who', 'type': 'address' }],
		'name': 'balanceOf',
		'outputs': [{ 'name': '', 'type': 'uint256' }],
		'payable': false,
		'stateMutability': 'view',
		'type': 'function',
	},
]

const ABI_MAP = {
	'USDT': ERC20_ABI,
	'USDC': USDC_ABI,
	'StETH': STETH_ABI,
	'UNI': UNI_ABI,
	'AAVE': AAVE_ABI,
	'DAI': DAI_ABI,
	'XAUT': XAUT_ABI,
	'RenBTC': RENBTC_ABI,
	'StkAAVE': STKAAVE_ABI,
	'BNB': BNB_ABI,
}

export function useToken(currency) {
	const web3Store = useWeb3Store()
	const { contractAddress, address } = storeToRefs(web3Store)
	// 账户余额
	let balance = ref(0)

	const tokenClientList = useLocalStorage('tokenClientList', [])

	const getBalance = async (checkedCurrency, callback) => {
		console.log('================getBalance begin============')
		await web3Store.initWallet()

		console.log('useToken-当前选择币种：', checkedCurrency, callback)
		console.log('useToken-当前选择地址：', address.value)
		const config = await getTokenConfig(checkedCurrency)
		console.log('useToken-币种对应的Token配置:', config)

		// if (config) {
		// 	// todo 地址	确认
		// 	const contract = new web3Store.web3.eth.Contract(ABI_MAP[checkedCurrency], contractAddress.value)
		//
		// 	try {
		// 		// 获取并显示代币余额
		// 		balance.value = await contract.methods.balanceOf(address.value).call()
		// 		// 用 BigNumber 处理余额，并将其转换为带有 config.decimals 位小数的格式
		// 		const decimals = config.decimals || 6 // 默认精度为 6，如果 config.decimals 没有定义
		// 		const divisor = new BigNumber(10).pow(decimals)
		// 		balance.value = new BigNumber(balance.value).dividedBy(divisor).toFixed(decimals)
		// 		console.log(`useToken-${checkedCurrency}代币余额:`, balance.value)
		// 		if(callback){
		// 			callback(balance.value)
		// 		}
		// 	} catch (e) {
		// 		console.log('获取余额失败:', e)
		// 	}
		// }

		try {
			const { data: config } = await getSingleChainTokenBalanceApi({
				walletToken: checkedCurrency,
			})
			const decimals = config.decimals || 6 // 默认精度为 6，如果 config.decimals 没有定义
			const divisor = new BigNumber(10).pow(decimals)
			balance.value = new BigNumber(config.balance).dividedBy(divisor).toFixed(decimals)
			console.log(`useToken-${checkedCurrency}代币余额:`, balance.value)
			if (callback) {
				callback(balance.value)
			}
		} catch (e) {
			console.log('useToken', '获取余额失败', e)
		}
	}

	// 获取币种配置列表====链上钱包余额
	const getTokenClientList = async () => {
		try {
			let tokenRes = await getAllChainTokenBalanceApi()
			tokenClientList.value = tokenRes.data?.tokenList || []
			console.log('useToken', '获取链上所有余额', tokenClientList.value)
		} catch (e) {
			console.log('useToken', '获取链上所有余额失败', e)
		}
	}

	// 获取指定币种配置信息====链上钱包余额
	const getTokenConfig = async (checkedCurrency) => {
		if (!tokenClientList.value.length) {
			await getTokenClientList()
		}
		console.log('useToken', '获取链上钱包余额', tokenClientList.value)
		const config = tokenClientList.value.find((e) => e.tokenName?.toLowerCase() === checkedCurrency.toLowerCase())
		if (config) {
			console.log('useToken', '币种对应的Token配置:', config)
		} else {
			console.error('useToken', '获取对应Token配置失败', checkedCurrency, tokenClientList.value)
		}
		return config
	}

	// // web3store的初始延迟
	// const timeout = setTimeout(() => {
	// 	getBalance(currency)
	// 	clearTimeout(timeout)
	// }, 100)

	return {
		balance,
		getBalance,
		tokenClientList,
		getTokenClientList,
		getTokenConfig,
	}
}
