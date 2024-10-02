<template>
	<div class="depositandwithdrawal_container custom-page full-page">
		<div>
			<van-nav-bar fixed :title="selectCoinInfo.currency" @click-left="onClickLeft">
				<template #left>
					<van-icon :name="arrow" size="18" />
				</template>
			</van-nav-bar>
		</div>
		<!-- 交易详情  -->
		<div class="transaction_details">
			<div class="transaction_details_left" @click="handleRouter('/records?tab=0')">
				<div class="icon-box">
					<img src="@/assets/images/user/card.svg" />
				</div>
				<div>
					<div class="title">{{ t('交易详情') }}</div>
					<div class="text">{{ t('查看交易历史') }}</div>
				</div>
			</div>
			<div>
				<van-icon name="arrow" color="#000" size="15" @click="handleRouter('/records?tab=0')" />
			</div>
		</div>
		<div class="tab-box">
			<van-tabs v-model:active="active" @change="tabChange">
				<!-- 快捷充值 -->
				<van-tab :title="t('快捷充值')" class="quickpay-tab">
					<div class="receive-title">{{ t('存款金额') }}:</div>
					<div class="address-box">
						<van-field clearable type="number" v-model="quickPayParams.amount" :placeholder="t('输入存款金额')">
							<template #right-icon>
								{{ selectCoinInfo.currency }}
							</template>
							<!-- <template #left-icon>
								<img class="usdc-icon" :src="selectCoinInfo.picUrl" />
							</template> -->
						</van-field>
					</div>
					<van-action-bar>
						<div class="Borrow">
							<van-button type="primary" @click="quickPayHandle">{{ t('继续') }}</van-button>
						</div>
					</van-action-bar>
				</van-tab>
				<!-- 充值 -->
				<van-tab :title="t('充值')">
					<div class="radio-box">
						<van-radio-group shape="dot" v-model="checkedProtocol" direction="horizontal">
							<van-radio :name="item.protocol" v-for="(item, index) in protocol" :key="index">{{ item.protocol }}</van-radio>
						</van-radio-group>
					</div>
					<div class="top_up_img_box">
						<img class="top_up_img" :src="qrcode" />
					</div>
					<div class="exchange-main">
						<div class="exchange-box">
							<div class="rate">
								<img src="@/assets/images/user/exchange.png" width="25" />
							</div>
							1{{ selectCoinInfo.currency }}=${{ exchangeRateValue }}
						</div>
					</div>

					<div class="copy-box">
						<div class="van-ellipsis">{{ rechargeAddress }}</div>

						<div class="copy-text" @click="copyHandle(rechargeAddress)">
							<img class="" src="@/assets/images/user/copy-icon.svg" />
							<span class="text">{{ t('复制') }}</span>
						</div>
					</div>
					<div class="centent">
						{{ t('请仔细检查存款地址以确保正确，因为错误的转账可能无法被撤销。存款需要获得 5 个区块的确认才能记入您的账户。') }}
					</div>

					<van-action-bar>
						<div class="Borrow">
							<van-button type="primary" @click="openUploadProof">{{ t('上传证明') }}</van-button>
						</div>
					</van-action-bar>
				</van-tab>
				<!-- 提款 -->
				<van-tab :title="t('提款')">
					<div class="withdrawal-text">
						<div class="title break-word">{{ t('提现金额') }}:</div>
						<div class="text">
							{{ t('可用') }}：
							<span class="break-number"> {{ platformAccount.balance }}</span>
							&nbsp;&nbsp;{{ selectCoinInfo.currency }}
						</div>
					</div>
					<div class="input-box">
						<van-field clearable type="number" v-model="widthdrawParams.amount" :placeholder="t('输入提现金额')">
							<template #right-icon>
								{{ selectCoinInfo.currency }}
							</template>
							<template #left-icon>
								<img class="usdc-icon" :src="$imgpath + selectCoinInfo.picUrl" />
							</template>
						</van-field>
					</div>
					<div class="receive-title">{{ t('接收地址') }}：</div>
					<div class="address-box">
						<van-field v-model="widthdrawParams.address" label="" :placeholder="t('请输入钱包地址')" />
					</div>
					<div class="rate-box">
						1{{ selectCoinInfo.currency }} ≈ $<span>{{ exchangeRateValue }}</span>
					</div>
					<div class="centent">
						{{ t('提现需要5%的手续费，需要网络节点确认后才能入账请不要将加密货币转给陌生人') }}
					</div>

					<van-action-bar>
						<div class="Borrow">
							<van-button type="primary" @click="widthdrawHandle">{{ t('继续') }}</van-button>
						</div>
					</van-action-bar>
				</van-tab>
				<!-- 交易 -->
				<van-tab :title="t('交易')" class="exchange-tab">
					<div class="exchange-title">
						<div class="title">{{ t('发送') }}:</div>
						<div class="text" @click="maxHandle">{{ t('最大') }}</div>
					</div>
					<div class="input-box">
						<van-field clearable v-model="exchangeAmount" @input="inputExchangeAmount" type="number" :placeholder="t('输入兑换金额')">
							<template #right-icon>
								{{ selectCoinInfo.currency }}
							</template>
							<template #left-icon>
								<img class="usdc-icon" :src="$imgpath + selectCoinInfo.picUrl" />
							</template>
						</van-field>
					</div>
					<div class="exchange-icon-box">
						<img class="exchange-icon" src="@/assets/images/user/exchange.svg" />
					</div>
					<div class="exchange-title">
						<div class="title">{{ t('接收') }}:</div>
					</div>
					<div class="input-box">
						<div class="menu-box">
							<van-dropdown-menu :overlay="false">
								<van-dropdown-item ref="dropdown_menu" v-model="value1">
									<div class="currency-box" @click="selectCurrency(item)" v-for="(item, index) in coinList" :key="index">
										<div>
											<img class="usdc-icon" :src="$imgpath + item.picUrl" />
										</div>
										<div>{{ item.currency }}</div>
									</div>
								</van-dropdown-item>
							</van-dropdown-menu>
						</div>
						<van-field v-model="toExchangeAmount" type="text" readonly placeholder="">
							<template #right-icon>
								<van-icon name="arrow-down" />
							</template>
							<template #left-icon>
								<div class="toCoin">
									<img v-if="exchangeSelectCoinInfo.picUrl" class="usdc-icon" :src="$imgpath + exchangeSelectCoinInfo.picUrl" />
									{{ exchangeSelectCoinInfo.currency || '' }}
								</div>
							</template>
						</van-field>
					</div>
					<div class="rate-box">
						1 {{ selectCoinInfo.currency }} ≈ <span>{{ toexchangeRate }}</span>
						{{ exchangeSelectCoinInfo.currency }}
					</div>

					<van-action-bar>
						<div class="Borrow">
							<van-button type="primary" @click="exchangeFun">{{ t('兑换') }}</van-button>
						</div>
					</van-action-bar>
				</van-tab>
			</van-tabs>
		</div>
	</div>
</template>

<script setup name="Lang">
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { userStore, useWeb3accountStroe } from '@/store'
import { storeToRefs } from 'pinia'
import arrow from '@/assets/images/user/arrow.png'
import {
	currencyProtocol,
  getCurrencyAllApi,
	platformaccountClientListApi,
	clientCurrencyExchange,
	withdrawOrderApplyApi,
	quickRechargeApi,
	exchangeRateFromTo,
	paymentAddressSettingApi,
} from '@/apiService'
import { showLoadingToast, closeToast, showToast } from 'vant'
import { useClipboard } from '@vueuse/core'
import { useQRCode } from '@vueuse/integrations/useQRCode'
import { useI18n } from 'vue-i18n'
import useLoading from '@/hooks/useLoading.js'

// 初始化仓库
const usersStore = userStore()
const { t } = useI18n()
const { copy } = useClipboard()
const web3accountStroe = useWeb3accountStroe()
const { checkedCurrency, tokenContractInfo } = storeToRefs(web3accountStroe)
const loading = useLoading()

// 变量区
const router = useRouter()
const route = useRoute()
const active = ref(0)
const checkedProtocol = ref('')
const value1 = ref('')
const protocol = ref([])
const exchangeRateValue = ref(0)
const exchangeAmount = ref()
const toExchangeAmount = ref()
const coinId = ref('')
const coinList = ref([])
const selectCoinInfo = ref({
	currency: '',
})
const dropdown_menu = ref(null)
const toexchangeRate = ref(0)

let qrcode = ''
const tabChange = (tab) => {
	if (tab === 1) {
		getExchangeRate(selectCoinInfo.value.currency)
		paymentAddressSetting()
	} else if (tab === 2) {
		getExchangeRate(selectCoinInfo.value.currency)
	}
}
// 快捷支付
const quickPayParams = ref({
	amount: '',
	coinType: '',
})
const quickPayHandle = async () => {
	try {
		if (!quickPayParams.value.amount || !parseFloat(quickPayParams.value.amount)) {
			showToast({ message: t('金额输入有误，请输入大于0的金额'), icon: 'info' })
			return
		}
		// const {balance:tokenBalance} = useToken(selectCoinInfo.value.currency)

		// if (quickPayParams.value.amount > tokenBalance.value * 1) {
		// 	showToast({ message: t('操作失败，您的代币余额不足'), icon: "info" })
		// 	return
		// }

		quickPayParams.value.coinType = selectCoinInfo.value.currency
		loading.loading()
		const res = await quickRechargeApi(quickPayParams.value)
		loading.clearLoading()
		showToast({
			message: t('操作成功'),
			icon: 'info',
		})
		quickPayParams.value.amount = ''
		router.push('/user')
	} catch (err) {
		console.log(err)
	}
}

const copyHandle = (str) => {
	copy(str)
	showToast({
		message: t('复制成功'),
		icon: 'info',
	})
}

// 代码区
const onClickLeft = () => {
	history.back()
	usersStore.SET_PATH_DATA('yes')
}
const getCurrencyprotocolList = async () => {
	try {
		loading.loading()
		const response = await currencyProtocol(coinId.value) // Fetch data from API
		loading.clearLoading()
		checkedProtocol.value = response.data[0].protocol
		protocol.value = response.data
	} catch (err) {
		// Handle errors
		console.log(err)
	}
}
const getExchangeRate = async (currency) => {
	try {
		loading.loading()
		const res = await exchangeRateFromTo({ from: currency, to: 'USDT' }) // Fetch data from API
		loading.clearLoading()
		exchangeRateValue.value = res.data?.rate || '1'
		toexchangeRate.value = res.data.rate
		// toExchangeAmount.value = toexchangeRate.value
	} catch (e) {
		console.log(e)
	}
}
// 充值地址
const rechargeAddress = ref('')
const paymentAddressSetting = async () => {
	try {
		loading.loading()
		const res = await paymentAddressSettingApi()
		loading.clearLoading()
		rechargeAddress.value = res.data
		qrcode = useQRCode(res.data)
	} catch (err) {
		console.log(err)
	}
}
const openUploadProof = () => {
	let filterList = protocol.value.filter((item) => {
		return item.protocol == checkedProtocol.value
	})
	if (filterList && filterList[0].id) {
		router.push({
			query: { pid: filterList[0].id, currency: selectCoinInfo.value.currency },
			path: '/uploadProof',
		})
	} else {
		showToast({
			message: t('无相关协议'),
			icon: 'info',
		})
	}
}

// 提现
const widthdrawParams = ref({
	address: '',
	amount: '',
})
const widthdrawHandle = async () => {
	try {
		if (!widthdrawParams.value.amount) {
			showToast({
				message: t('输入提现金额'),
				icon: 'info',
			})
			return
		} else if (!parseFloat(widthdrawParams.value.amount)) {
			showToast({ message: t('金额输入有误，请输入大于0的金额'), icon: 'info' })
			return
		} else if (!widthdrawParams.value.address) {
			showToast({
				message: t('请输入钱包地址'),
				icon: 'info',
			})
			return
		}
		const params = {
			currency: selectCoinInfo.value.currency,
			...widthdrawParams.value,
		}
		loading.loading()
		const res = await withdrawOrderApplyApi(params)
		loading.clearLoading()
		showToast({
			message: t('操作成功'),
			icon: 'info',
		})
		widthdrawParams.value.amount = ''

		// 操作成功后，更新余额
		const timeout = setTimeout(() => {
			platformaccountClientList()
			clearTimeout(timeout)
		}, 3000)
	} catch (error) {
		console.log(error)
	}
}

const getCurrencyList = async () => {
	try {
		loading.loading()
		const response = await getCurrencyAllApi() // Fetch data from API
		loading.clearLoading()
		let filterList = []
		filterList = response.data.filter((item) => {
			return item.id !== coinId.value
		})

		selectCoinInfo.value = response.data.find((item) => item.id === coinId.value)
		if (filterList.length > 0) {
			coinList.value = filterList
			platformaccountClientList()
		}
	} catch (e) {
		console.log(e)
	}
}
const platformAccount = ref({
	balance: 0,
})
const platformaccountClientList = async () => {
	try {
		loading.loading()
		const res = await platformaccountClientListApi()
		loading.clearLoading()
		console.log('ddd', res.data, platformAccount.value)
		platformAccount.value = res.data.find((item) => item.coinCode && item.coinCode.toLowerCase() === selectCoinInfo.value.currency.toLowerCase()) || {
			balance: 0,
		}
	} catch (err) {
		console.log(err)
	}
}

// 交换
const maxHandle = () => {
	exchangeAmount.value = platformAccount.value.balance
}
const exchangeSelectCoinInfo = ref({})
const selectCurrency = async (item) => {
	try {
		exchangeSelectCoinInfo.value = item
		dropdown_menu.value?.toggle()
		loading.loading()
		const res = await exchangeRateFromTo({ from: selectCoinInfo.value.currency, to: exchangeSelectCoinInfo.value.currency })
		loading.clearLoading()
		toexchangeRate.value = res.data.rate
		if (exchangeAmount.value) {
			toExchangeAmount.value = toexchangeRate.value * exchangeAmount.value
		}
	} catch (e) {
		console.log(e)
	}
}

const inputExchangeAmount = () => {
	if (!exchangeAmount.value) {
		exchangeAmount.value = 1
	}
	if (exchangeSelectCoinInfo.value.currency) {
		toExchangeAmount.value = exchangeAmount.value * toexchangeRate.value
	}
}
const exchangeFun = async () => {
	try {
		if (!exchangeAmount.value) {
			showToast({
				message: t('请输入兑换金额'),
				icon: 'info',
			})
			return
		} else if (!parseFloat(exchangeAmount.value)) {
			showToast({ message: t('金额输入有误，请输入大于0的金额'), icon: 'info' })
			return
		} else if (!exchangeSelectCoinInfo.value.currency) {
			showToast({ message: t('请选择接受币种'), icon: 'info' })
			return
		}
		if (exchangeAmount.value * 1 > platformAccount.value.balance * 1) {
			showToast({
				message: t('余额不足,超出最大值'),
				icon: 'info',
			})
			return
		}

		let dataInfo = {
			coinCode: selectCoinInfo.value.currency,
			exchangeCoinCode: exchangeSelectCoinInfo.value.currency,
			amount: parseFloat(exchangeAmount.value),
			userId: usersStore.userInfo.id,
		}
		loading.loading()
		const res = await clientCurrencyExchange(dataInfo) // Fetch data from API
		loading.clearLoading()
		showToast({
			message: t('申请成功'),
			icon: 'info',
		})
		setTimeout(() => {
			router.go(-1)
		}, 1000)
		closeToast()
	} catch (e) {
		console.log(e)
	}
}

// 路由跳转
const handleRouter = (path) => {
	usersStore.SET_PATH_DATA('no')
	router.push(`${path}`)
}

onMounted(() => {
	if (route.query?.id) {
		// currency.value = route.query.currency
		coinId.value = route.query.id * 1
	}

	usersStore.SET_PATH_DATA('no')
	getCurrencyprotocolList()
	getCurrencyList()
})

// 将组件中的数据进行暴露出去
defineExpose({})
</script>

<style lang="scss" scoped>
.depositandwithdrawal_container {
	font-size: 30px;
	background: #fff;
	//padding-top: 0;
	padding-bottom: 40px;
	//height: 100vh;

	:deep .van-tabs__line {
		display: none;
	}

	:deep .van-tabs__nav {
		overflow-x: auto;
	}

	:deep .van-tabs__wrap {
		height: 40px;
	}

	:deep .van-tab {
		font-size: 15px;
		color: #000000;
		margin: 0 7.5px;
		padding: 0 16px;
		flex: auto;
		white-space: nowrap;
	}

	:deep .van-tab--active {
		background: rgba(130, 169, 249, 0.3);
		color: #82a9f9;
		border-radius: 40px;
	}

	.transaction_details {
		display: flex;
		justify-content: space-between;
		margin: 0 40px;
		align-items: center;
		border: 2px solid #e8e8e8;
		border-radius: 12px;
		padding: 20px 30px;
		margin-top: 20px;

		.transaction_details_left {
			display: flex;
			align-items: center;
			font-size: 28px;
			flex: 1;

			.icon-box {
				width: 90px;
				height: 90px;
				background: rgba(130, 169, 249, 0.3);
				border-radius: 10px;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-right: 30px;
			}

			.title {
				color: #121212;
				font-weight: 500;
			}

			.text {
				color: #bbb;
			}
		}
	}

	.tab-box {
		margin: 0 40px;
		margin-top: 40px;

		.exchange-tab {
			margin-top: 48px;
		}

		.exchange-icon-box {
			display: flex;
			justify-content: center;
			margin-top: 20px;
		}

		.top_up_img_box {
			display: flex;
			justify-content: center;
			margin-top: 40px;

			.top_up_img {
				width: 300px;
				height: 300px;
			}
		}

		.radio-box {
			display: flex;
			justify-content: center;
			margin-top: 48px;
		}

		.exchange-main {
			display: flex;
			justify-content: center;
		}

		.exchange-box {
			margin: 0 auto;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			padding: 10px 10px;
			background: rgba(130, 169, 249, 0.3);
			font-size: 28px;
			font-weight: 600;
			border-radius: 30px;
			margin-top: 40px;

			.rate {
				width: 45px;
				height: 45px;
				margin-right: 10px;
				border-radius: 50%;
				background: #82a9f9;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}

		.currency-box {
			display: flex;
			justify-content: space-between;
			margin: 0 70px;
			padding: 20px 0;
		}

		.toCoin {
			display: flex;
			align-items: center;

			img {
				margin-right: 20px;
			}
		}

		.exchange-title {
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 26px;

			.title {
				color: #b8b8b8;
			}

			.text {
				color: #82a9f9;
			}
		}

		.copy-box {
			display: flex;
			align-items: center;
			background: rgba(130, 169, 249, 0.1);
			border: 2px dashed #82a9f9;
			border-radius: 10px;
			padding: 20px 20px;
			margin: 0 20px;
			font-weight: 600;
			color: #121212;
			margin-top: 40px;

			.copy-text {
				display: flex;
				align-items: center;
				margin-left: 15px;

				.text {
					margin-left: 20px;
					font-weight: 600;
					color: #82a9f9;
					white-space: nowrap;
				}
			}
		}

		.receive-title {
			color: #b8b8b8;
			padding: 30px 0;
		}

		.withdrawal-text {
			font-size: 25px;
			display: flex;
			justify-content: space-between;
			margin-top: 48px;

			.title {
				color: #b8b8b8;
				margin-right: 20px;
			}

			.text {
				display: flex;

				span {
					color: #82a9f9;
				}
			}
		}

		.centent {
			margin-top: 40px;
		}

		:deep(.address-box) {
			border-radius: 20px;
			height: 100px;

			.van-cell {
				width: 100%;
				background: #f9fafb;
			}
		}

		.rate-box {
			font-size: 26px;
			color: #121212;
			text-align: center;
			margin-top: 40px;

			span {
				color: #82a9f9;
			}
		}

		.input-box {
			background: #f9fafb;
			border-radius: 20px;
			margin-top: 20px;
			position: relative;

			.menu-box {
				position: absolute;
				width: 100%;
				height: 100%;
				opacity: 1;
				top: 0;
				left: 0;
				z-index: 2;

				:deep .van-dropdown-menu__bar {
					opacity: 0;
				}
			}

			:deep .van-field {
				background: #f9fafb;

				.van-field__right-icon {
					color: #000;
				}

				.van-field__left-icon {
					margin-right: 10px;
				}
			}

			.usdc-icon {
				width: 45px;
				height: 45px;
			}
		}
	}

	:deep(.quickpay-tab) {
		.receive-title {
			margin-top: 48px;
			padding: 0;
			margin-bottom: 34px;
		}

		.address-box {
			.van-field__right-icon {
				color: #222;
				font-size: 16px;
				font-weight: 500;
			}
		}
	}

	:deep(.van-tab__panel) {
		padding-bottom: 85px;
	}

	.van-action-bar {
		height: 56px;
		padding: 5px 25px 24px;

		.Borrow {
			//margin-top: 40px;
			width: 100%;

			:deep .van-button--normal {
				width: 100%;
				border-radius: 30px;
				height: 56px;
				background: #82a8f9;
			}
		}
	}

	:deep(.van-dropdown-item__content) {
		width: calc(100% - 48px);
		left: 24px;
		border-radius: 16px;
		box-shadow: 0.06rem 0.12rem 0.2rem #0000001a;

		.item {
			height: 50px;
			line-height: 50px;
			text-align: center;
			padding-left: 20px;
			color: #000000d9;
			font-size: 16px;
			border-bottom: 0.01rem solid rgba(0, 0, 0, 0.07);
		}
	}
}
</style>
