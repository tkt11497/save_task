import { ref, computed } from 'vue'
import Web3 from 'web3'
import BigNumber from 'bignumber.js'
import { DAI_ABI, UNI_ABI, AAVE_ABI, XAUT_ABI, RENBTC_ABI, USDC_ABI, STETH_ABI, STKAAVE_ABI, BNB_ABI } from '@/config/abi.js'
import { useRequest } from '@/hooks/fetch.js'
import { tokenClientListeApi } from '@/apiService'

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
	console.log('useToken', currency)
	const web3 = ref(null)
	const accounts = ref([])
	let balance = ref(0)

	const getBalance = async (checkedCurrency,callback) => {
		if (window.ethereum) {
			web3.value = new Web3(window.ethereum)
			// 请求用户授权
			accounts.value = await window.ethereum.request({ method: 'eth_requestAccounts' })
		} else if (window.web3) {
			web3.value = new Web3(window.web3.currentProvider)
			accounts.value = await window.web3.eth.getAccounts()
		} else {
			console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
		}

		const address = computed(() => accounts.value?.[0] ?? '')

		// const { response: tokenList } = useRequest({
		//     url: '/system/token/clientList',
		//     method: 'post',
		//     initialValues: []
		// })
		const tokenList = JSON.parse(localStorage.getItem('tokenClientList'))
		if(!tokenList || tokenList.length===0){
			let tokenRes = await tokenClientListeApi()
			tokenList = tokenRes.data
		}

		console.log('useToken-当前选择币种：', checkedCurrency,callback)
		console.log('useToken-当前选择地址：', address.value)
		const config = tokenList.find((e) => e.name === checkedCurrency)
		console.log('useToken-币种对应的Token配置:', config)

		if (config) {
			const contract = new web3.value.eth.Contract(ABI_MAP[checkedCurrency], config.address)

			try {
				// 获取并显示代币余额
				balance.value = await contract.methods.balanceOf(address.value).call()
				// 用 BigNumber 处理余额，并将其转换为带有 config.decimals 位小数的格式
				const decimals = config.decimals || 6 // 默认精度为 6，如果 config.decimals 没有定义
				const divisor = new BigNumber(10).pow(decimals)
				balance.value = new BigNumber(balance.value).dividedBy(divisor).toFixed(decimals)
				console.log(`useToken-${checkedCurrency}代币余额:`, balance.value)
				if(callback){
					callback(balance.value)
				}
			} catch (e) {
				console.log('获取余额失败:', e)
			}

			// switch (currency) {
			//     case 'USDT':
			//         const usdtContract = new web3.value.eth.Contract(ERC20_ABI, config.address)

			//         try {
			//             // 获取并显示代币余额
			//             balance.value = await usdtContract.methods.balanceOf(address.value).call();
			//                  console.log(`${currency}代币余额:`, balance)
			//             } catch (e) {
			//                 console.log('获取余额失败:', e);
			//             }
			//     break;
			//     case 'USDC':
			//         const usdcContract = new web3.value.eth.Contract(USDC_ABI, config.address)

			//         try {
			//             // 获取并显示代币余额
			//             balance.value = await usdcContract.methods.balanceOf(address.value).call();
			//                  console.log(`${currency}代币余额:`, balance)
			//             } catch (e) {
			//                 console.log('获取余额失败:', e);
			//             }
			//     break;
			//     case 'StETH':
			//         const StETHContract = new web3.value.eth.Contract(STETH_ABI, config.address)

			//         try {
			//             // 获取并显示代币余额
			//             balance.value = await StETHContract.methods.balanceOf(address.value).call();
			//                  console.log(`${currency}代币余额:`, balance)
			//             } catch (e) {
			//                 console.log('获取余额失败:', e);
			//             }
			//     break;
			//     case 'UNI':
			//         const UNIContract = new web3.value.eth.Contract(UNI_ABI, config.address)

			//         try {
			//             // 获取并显示代币余额
			//             balance.value = await UNIContract.methods.balanceOf(address.value).call();
			//                  console.log(`${currency}代币余额:`, balance)
			//             } catch (e) {
			//                 console.log('获取余额失败:', e);
			//             }
			//     break;
			//     case 'AAVE':
			//         const AAVEContract = new web3.value.eth.Contract(AAVE_ABI, config.address)

			//         try {
			//             // 获取并显示代币余额
			//             balance.value = await AAVEContract.methods.balanceOf(address.value).call();
			//                  console.log(`${currency}代币余额:`, balance)
			//             } catch (e) {
			//                 console.log('获取余额失败:', e);
			//             }
			//     break;
			//     case 'DAI':
			//         const DAIContract = new web3.value.eth.Contract(DAI_ABI, config.address)

			//         try {
			//             // 获取并显示代币余额
			//             balance.value = await DAIContract.methods.balanceOf(address.value).call();
			//                  console.log(`${currency}代币余额:`, balance)
			//             } catch (e) {
			//                 console.log('获取余额失败:', e);
			//             }
			//     break;
			//     case 'XAUT':
			//         const XAUTContract = new web3.value.eth.Contract(XAUT_ABI, config.address)

			//         try {
			//             // 获取并显示代币余额
			//             balance.value = await XAUTContract.methods.balanceOf(address.value).call();
			//                  console.log(`${currency}代币余额:`, balance)
			//             } catch (e) {
			//                 console.log('获取余额失败:', e);
			//             }
			//     break;
			//     case 'RenBTC':
			//         const RenBTCContract = new web3.value.eth.Contract(RENBTC_ABI, config.address)

			//         try {
			//             // 获取并显示代币余额
			//             balance.value = await RenBTCContract.methods.balanceOf(address.value).call();
			//                  console.log(`${currency}代币余额:`, balance)
			//             } catch (e) {
			//                 console.log('获取余额失败:', e);
			//             }
			//     break;
			//     case 'StkAAVE':
			//         const StkAAVEContract = new web3.value.eth.Contract(STKAAVE_ABI, config.address)

			//         try {
			//             // 获取并显示代币余额
			//             balance.value = await StkAAVEContract.methods.balanceOf(address.value).call();
			//                  console.log(`${currency}代币余额:`, balance)
			//             } catch (e) {
			//                 console.log('获取余额失败:', e);
			//             }
			//     break;
			//     case 'BNB':
			//         const BNBContract = new web3.value.eth.Contract(BNB_ABI, config.address)

			//         try {
			//             // 获取并显示代币余额
			//             balance.value = await BNBContract.methods.balanceOf(address.value).call();
			//                  console.log(`${currency}代币余额:`, balance)
			//             } catch (e) {
			//                 console.log('获取余额失败:', e);
			//             }
			//     break;
			// }
		}
	}

	getBalance(currency)

	return {
		balance,
		getBalance,
	}
}
