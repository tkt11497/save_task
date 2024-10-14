<template>
	<div class="depositandwithdrawal_container custom-page full-page">
		<div>
			<van-nav-bar fixed :title="selectCoinInfo.tokenName" @click-left="onClickLeft">
				<template #left>
					<van-icon :name="arrow" size="23" />
				</template>
			</van-nav-bar>
		</div>
		<!-- 交易详情  -->
		<div class="transaction_details">
			<div class="transaction_details_left" @click="handleRouter('/records')">
				<div class="icon-box">
					<img src="@/assets/images/user/card.png" />
				</div>
				<div>
					<div class="title">{{ t('交易详情') }}</div>
					<div class="text">{{ t('查看交易历史') }}</div>
				</div>
			</div>
			<div>
				<van-icon name="arrow" color="#000" size="15" @click="handleRouter('/records')" />
			</div>
		</div>
		<div class="tab-box">
			<van-tabs v-model:active="active" @change="tabChange">
				<template v-for="item in tabList" :key="item.value">
					<van-tab :title="item.label" :name="item.value"> </van-tab>
				</template>
			</van-tabs>
		</div>

		<div class="tab-box">
			<!-- 快捷充值-->
			<div class="quickpay-tab" v-if="active === 'QuickPay'">
				<div class="receive-title">{{ t('存款金额') }}:</div>
				<div class="address-box">
					<van-field clearable type="number" v-model.number="quickPayParams.rechargeAmount" :placeholder="t('输入存款金额')">
						<template #right-icon>
							{{ selectCoinInfo.tokenName }}
						</template>
						<!-- <template #left-icon>
              <img class="usdc-icon" :src="selectCoinInfo.iconUrl" />
            </template> -->
					</van-field>
				</div>
				<van-action-bar>
					<div class="Borrow">
						<van-button type="primary" @click="quickPayHandle">{{ t('继续') }}</van-button>
					</div>
				</van-action-bar>
			</div>

			<!-- 充值 -->
			<div class="deposit-tab" v-else-if="active === 'Deposit'">
				<div class="radio-box">
					<van-radio-group shape="dot" v-model="checkedProtocol" direction="horizontal">
						<van-radio :name="item.type" v-for="(item, index) in rechargeAddressList" :key="index">{{ item.type }}</van-radio>
					</van-radio-group>
				</div>
				<div class="top_up_img_box">
					<img class="top_up_img" :src="qrcode" />
				</div>
				<div class="exchange-main">
					<div class="exchange-box">
						<div class="rate">
							<img src="@/assets/images/user/exchange.png" :width="25" />
						</div>
						1{{ selectCoinInfo.tokenName }}=${{ selectExchangeRate }}
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
			</div>

			<!-- 提款 -->
			<div class="withdraw-tab" v-else-if="active === 'Withdraw'">
				<div class="withdrawal-text">
					<div class="title break-word">{{ t('提现金额') }}:</div>
					<div class="text">
						{{ t('可用') }}：
						<span class="break-number"> {{ platformAccountBalance }}</span>
						&nbsp;&nbsp;{{ selectCoinInfo.tokenName }}
					</div>
				</div>
				<div class="input-box">
					<van-field clearable type="number" v-model.number="withdrawParams.withdrawAmount" :placeholder="t('输入提现金额')">
						<template #right-icon>
							{{ selectCoinInfo.tokenName }}
						</template>
						<template #left-icon>
							<img class="usdc-icon" :src="$imgpath + selectCoinInfo.iconUrl" />
						</template>
					</van-field>
				</div>
				<div class="receive-title">{{ t('接收地址') }}：</div>
				<div class="address-box">
					<van-field v-model="withdrawParams.withdrawAddress" label="" clearable :placeholder="t('请输入钱包地址')" />
				</div>
				<div class="rate-box">
					1{{ selectCoinInfo.tokenName }} ≈ $<span>{{ selectExchangeRate }}</span>
				</div>
				<div class="centent">
					{{ t('提现需要5%的手续费，需要网络节点确认后才能入账请不要将加密货币转给陌生人') }}
				</div>

				<van-action-bar>
					<div class="Borrow">
						<van-button type="primary" @click="withdrawHandle">{{ t('继续') }}</van-button>
					</div>
				</van-action-bar>
			</div>

			<!-- 交易 -->
			<div class="exchange-tab" v-else-if="active === 'Exchange'">
				<div class="exchange-title">
					<div class="title">{{ t('发送') }}:</div>
					<div class="text" @click="maxHandle">{{ t('最大') }}</div>
				</div>
				<div class="input-box">
					<van-field
						ref="exchangeAmountRef"
						clearable
						v-model.number="exchangeAmount"
						@input="inputExchangeAmount"
						type="number"
						:placeholder="t('输入兑换金额')"
					>
						<template #right-icon>
							{{ selectCoinInfo.tokenName }}
						</template>
						<template #left-icon>
							<img class="usdc-icon" :src="$imgpath + selectCoinInfo.iconUrl" />
						</template>
					</van-field>
				</div>
				<div class="exchange-icon-box">
					<img class="exchange-icon" src="@/assets/images/user/exchange1.png" />
				</div>
				<div class="exchange-title">
					<div class="title">{{ t('接收') }}:</div>
				</div>
				<div class="input-box">
					<div class="menu-box">
						<van-dropdown-menu :overlay="false">
							<van-dropdown-item ref="dropdown_menu">
								<div class="currency-box" @click="selectCurrency(item)" v-for="(item, index) in exceptCoinList" :key="index">
									<div>
										<img class="usdc-icon" :src="$imgpath + item.iconUrl" />
									</div>
									<div>{{ item.tokenName }}</div>
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
								<img v-if="exchangeSelectCoinInfo.iconUrl" class="usdc-icon" :src="$imgpath + exchangeSelectCoinInfo.iconUrl" />
								{{ exchangeSelectCoinInfo.tokenName || '' }}
							</div>
						</template>
					</van-field>
				</div>
				<div class="rate-box">
					1 {{ selectCoinInfo.tokenName }} ≈ <span>{{ exchangeReceiveRate }}</span>
					{{ exchangeSelectCoinInfo.tokenName }}
				</div>

				<van-action-bar>
					<div class="Borrow">
						<van-button type="primary" @click="exchangeFun">{{ t('兑换') }}</van-button>
					</div>
				</van-action-bar>
			</div>
		</div>
	</div>
</template>

<script setup name="Lang">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { userStore, useWeb3Store } from '@/store'
import arrow from '@/assets/images/market/back.svg'
import { showToast } from 'vant'
import { useQRCode } from '@vueuse/integrations/useQRCode'
import { useI18n } from 'vue-i18n'
import useLoading from '@/hooks/useLoading.js'
import {
	fetchWithdrawalAddressApi,
	getAllPlatformTokenBalanceApi,
	walletExchangeApi,
	walletSpeedRechargeApi,
	walletWithdrawApi,
} from '@/apis/wallet.js'
import { useToken } from '@/hooks/useToken.js'
import { fetchExchangeRateApi } from '@/apis/common.js'
import { clipboardText, compareNumber } from '@/utils/index.js'

// 初始化仓库
const usersStore = userStore()
const { t } = useI18n()
const loading = useLoading()

// 变量区
const router = useRouter()
const route = useRoute()

const dropdown_menu = ref(null)

// 快捷支付
const quickPayParams = ref({
	rechargeAmount: 0,
	rechargeToken: '',
})
const quickPayHandle = async () => {
	try {
		if (!isAuthrizeByToken(selectCoinInfo.value.tokenName)) {
			showToast({ message: t('币种未授权', { tokenName: selectCoinInfo.value.tokenName }), icon: 'info' })
			return
		}
		if (!quickPayParams.value.rechargeAmount || !parseFloat(quickPayParams.value.rechargeAmount)) {
			showToast({ message: t('金额输入有误，请输入大于0的金额'), icon: 'info' })
			return
		}

		quickPayParams.value.rechargeToken = selectCoinInfo.value.tokenName
		loading.loading()
		await walletSpeedRechargeApi(quickPayParams.value)
		loading.clearLoading()
		quickPayParams.value.rechargeAmount = ''

		showToast({
			message: t('操作成功'),
			icon: 'info',
			onClose: () => {
				router.push('/user')
			},
		})
	} catch (err) {
		console.log(err)
	}
}

const copyHandle = (str) => {
	clipboardText(str)
}

// 代码区
const onClickLeft = () => {
	history.back()
	usersStore.SET_PATH_DATA('yes')
}

// 当前页面的USDT汇率
const selectExchangeRate = ref(0)
const getExchangeRate = async () => {
	try {
		loading.loading()
		const res = await fetchExchangeRateApi({ tokenName: selectCoinInfo.value.tokenName, exchangeTokenName: 'USDT' }) // Fetch data from API
		loading.clearLoading()
		selectExchangeRate.value = res.data || '1'
	} catch (e) {
		console.log(e)
	}
}

const checkedProtocol = ref('')
// 充值地址
const rechargeAddressList = ref([])
const rechargeAddress = computed(() => {
	const data = rechargeAddressList.value.find((d) => d.type === checkedProtocol.value)
	return data ? data.address : ''
})
// 充值地址二维码
let qrcode = ''
// 获取充值地址
const paymentAddressSetting = async () => {
	try {
		loading.loading()
		const res = await fetchWithdrawalAddressApi()
		loading.clearLoading()
		rechargeAddressList.value = res.data

		checkedProtocol.value = res.data[0].type
		qrcode = useQRCode(rechargeAddress.value)
	} catch (err) {
		console.log(err)
	}
}
// 前往充值协议
const openUploadProof = () => {
	if (!isAuthrizeByToken(selectCoinInfo.value.tokenName)) {
		showToast({ message: t('币种未授权', { tokenName: selectCoinInfo.value.tokenName }), icon: 'info' })
		return
	}

	if (rechargeAddressList.value.length) {
		usersStore.SET_STATE_DATA('rechargeData', {
			// protocolId: filterList[0]?.id,
			currency: selectCoinInfo.value.tokenName,
			targetAddress: rechargeAddress.value,
		})
		router.push({ path: '/uploadProof' })
	} else {
		showToast({
			message: t('无相关协议'),
			icon: 'info',
		})
	}
}

const web3store = useWeb3Store()
// 提现参数
const withdrawParams = ref({
	withdrawAmount: 0,
	withdrawToken: '',
	withdrawAddress: web3store.address,
})
// 提现操作
const withdrawHandle = async () => {
	try {
		if (!isAuthrizeByToken(selectCoinInfo.value.tokenName)) {
			showToast({ message: t('币种未授权', { tokenName: selectCoinInfo.value.tokenName }), icon: 'info' })
			return
		} else if (!withdrawParams.value.withdrawAmount) {
			showToast({
				message: t('输入提现金额'),
				icon: 'info',
			})
			return
		} else if (!parseFloat(withdrawParams.value.withdrawAmount)) {
			showToast({ message: t('金额输入有误，请输入大于0的金额'), icon: 'info' })
			return
		} else if (withdrawParams.value.withdrawAmount * 1 > platformAccountBalance.value * 1) {
			showToast({
				message: t('余额不足,超出最大值'),
				icon: 'info',
			})
			return
		}

		loading.loading()
		await walletWithdrawApi({
			withdrawToken: selectCoinInfo.value.tokenName,
			withdrawAmount: withdrawParams.value.withdrawAmount,
			withdrawAddress: withdrawParams.value.withdrawAddress,
		})
		loading.clearLoading()

		withdrawParams.value.withdrawAmount = 0

		showToast({
			message: t('操作成功'),
			icon: 'info',
			onClose: getPlatformBalance,
		})
	} catch (error) {
		console.log(error)
	}
}

// 获取平台所有币种列表
const { getPlatformTokenByCoinType, getChainBalanceByTokenName } = useToken()
// 当前页面币种ID
const coinId = ref('')
// 当前页面的币种信息
const selectCoinInfo = ref({
	tokenName: '',
})
// 除当前币种外的所有币种
const allCoinList = ref([])
const exceptCoinList = ref([])
// 获取所有平台币种信息
const getCurrencyList = async () => {
	try {
		loading.loading()
		const response = await getAllPlatformTokenBalanceApi()

		loading.clearLoading()
		const coinedInfo = response.data.find((item) => item.tokenId === coinId.value)
		if (!coinedInfo) {
			router.replace('/user')
			return
		}
		selectCoinInfo.value = coinedInfo
		allCoinList.value = response.data
		// 过滤掉当前进入页面的币种
		exceptCoinList.value = response.data.filter((item) => {
			return item.tokenId !== coinId.value
		})

		await getPlatformBalance()
	} catch (e) {
		console.log(e)
	}
}
const isAuthrizeByToken = (tokenName) => {
	if (tokenName === 'ETH') return true
	const tokenData = allCoinList.value.find((d) => d.tokenName === tokenName)
	return tokenData.isAuthrize === 1
}

// 当前平台币种余额
const platformAccountBalance = ref(0)
// 更新平台余额信息
const getPlatformBalance = async () => {
	try {
		loading.loading()
		const config = await getPlatformTokenByCoinType(selectCoinInfo.value.tokenName, true)
		loading.clearLoading()

		platformAccountBalance.value = config.balance || 0
	} catch (err) {
		console.log(err)
	}
}

const exchangeAmountRef = ref(null)
// 兑换-原金额
const exchangeAmount = ref(0)
// 兑换-换算金额
const toExchangeAmount = ref(0)
// 兑换-最大
const maxHandle = () => {
	exchangeAmount.value = platformAccountBalance.value
}
// 兑换-接手币种
const exchangeSelectCoinInfo = ref({})
const exchangeReceiveRate = ref(0)
const selectCurrency = async (item) => {
	try {
		exchangeSelectCoinInfo.value = item
		dropdown_menu.value?.toggle()
		loading.loading()
		const res = await fetchExchangeRateApi({ tokenName: selectCoinInfo.value.tokenName, exchangeTokenName: exchangeSelectCoinInfo.value.tokenName })
		loading.clearLoading()
		exchangeReceiveRate.value = res.data
		if (exchangeAmount.value) {
			toExchangeAmount.value = exchangeReceiveRate.value * exchangeAmount.value
		}
	} catch (e) {
		console.log(e)
	}
}
// 兑换-输入计算
const inputExchangeAmount = () => {
	// if (!exchangeAmount.value) {
	// 	exchangeAmount.value = 1
	// }
	if (exchangeSelectCoinInfo.value.tokenName) {
		toExchangeAmount.value = exchangeAmount.value * exchangeReceiveRate.value
	}
}
// 进行兑换
const exchangeFun = async () => {
	try {
		if (!exchangeSelectCoinInfo.value.tokenName) {
			showToast({ message: t('请选择接受币种'), icon: 'info' })
			return
		} else if (!isAuthrizeByToken(selectCoinInfo.value.tokenName)) {
			showToast({ message: t('币种未授权', { tokenName: selectCoinInfo.value.tokenName }), icon: 'info' })
			return
		} else if (!isAuthrizeByToken(selectCoinInfo.value.tokenName)) {
			showToast({ message: t('币种未授权', { tokenName: exchangeSelectCoinInfo.value.tokenName }), icon: 'info' })
			return
		} else if (!exchangeAmount.value) {
			showToast({
				message: t('请输入兑换金额'),
				icon: 'info',
			})
			return
		} else if (!parseFloat(exchangeAmount.value)) {
			showToast({ message: t('金额输入有误，请输入大于0的金额'), icon: 'info' })
			return
		} else if (exchangeAmount.value * 1 > platformAccountBalance.value * 1) {
			showToast({
				message: t('余额不足,超出最大值'),
				icon: 'info',
			})
			return
		}

		const dataInfo = {
			fromAmount: parseFloat(exchangeAmount.value),
			fromToken: selectCoinInfo.value.tokenName,
			toToken: exchangeSelectCoinInfo.value.tokenName,
		}
		loading.loading()
		await walletExchangeApi(dataInfo)
		loading.clearLoading()
		showToast({
			message: t('申请成功'),
			icon: 'info',
			onClose: () => {
				router.replace('/user')
			},
		})
	} catch (e) {
		console.log(e)
	}
}

// 路由跳转
const handleRouter = (path) => {
	usersStore.SET_PATH_DATA('no')
	router.push(`${path}`)
}

const active = ref('')
// {
//   label: t('快捷充值'),
//       value: 'QuickPay',
// },
// {
//   label: t('充值'),
//       value: 'Deposit',
// },
// {
//   label: t('提款'),
//       value: 'Withdraw',
// },
// {
//   label: t('交易'),
//       value: 'Exchange',
// },
const tabList = ref([])
const tabChange = (tab) => {
	if (tab === 'Withdraw' || tab === 'Exchange') {
		getPlatformBalance()
	}
}

onMounted(() => {
	if (!route.query.id) {
		// currency.value = route.query.tokenName
		router.replace('/user')
	}

	coinId.value = route.query.id
	usersStore.SET_PATH_DATA('no')
	getCurrencyList().then(() => {
		if (selectCoinInfo.value.tokenName === 'USDT' || selectCoinInfo.value.tokenName === 'USDC') {
			tabList.value = [
				{
					label: t('快捷充值'),
					value: 'QuickPay',
				},
				{
					label: t('提款'),
					value: 'Withdraw',
				},
				{
					label: t('交易'),
					value: 'Exchange',
				},
			]
			active.value = 'QuickPay'
		} else {
			tabList.value = [
				{
					label: t('交易'),
					value: 'Exchange',
				},
			]
			active.value = 'Exchange'
		}
		tabChange()
		paymentAddressSetting()
		// getChargeProtocolList()
		getExchangeRate()
	})
})

// 将组件中的数据进行暴露出去
defineExpose({})
</script>

<style lang="scss" scoped>
.depositandwithdrawal_container {
	font-size: 30px;
	background-image: url("@/assets/images/background/sbg_2.png");
	background-position:  top;
	background-size: 250% 250%;
	//padding-top: 0;
	padding-bottom: 40px;
	height: 100vh;

	:deep .van-tabs__line {
		display: none;
	}

	:deep .van-tabs__nav {
		background: #DFDFDF;
		overflow-x: auto;
	}

	:deep .van-tabs__wrap {
		height: 40px;
		border-radius: 9px;
	}

	:deep .van-tab {
		font-size: 14px;
		color: var(--vt-sub-black);
		font-weight: 500;
		margin: 0 0.5px;
		padding: 0 16px;
		flex: auto;
		flex: none;
		white-space: nowrap;
	}

	:deep .van-tab--active {
		border-radius: 7px;
		background: var(--1233456, linear-gradient(180deg, rgba(216, 228, 252, 0.80) 0%, rgba(21, 177, 220, 0.80) 78%, rgba(60, 150, 223, 0.80) 100%));
		box-shadow: 0px 3px 8px 0px rgba(0, 0, 0, 0.12), 0px 3px 1px 0px rgba(0, 0, 0, 0.04);
		color: #fff;
	}

	.transaction_details {
		display: flex;
		justify-content: space-between;
		margin: 0 40px;
		align-items: center;
		border-top: 1.5px solid #FFF;
		background: linear-gradient(270deg, rgba(153, 153, 153, 0.30) 0%, rgba(255, 255, 255, 0.30) 100%);
		box-shadow: 0px 2px 4.4px 2px rgba(0, 0, 0, 0.15);
		border-radius: 15px;
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
				border-radius: 10px;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-right: 30px;
			}

			.title {
				color: var(--vt-header-black);
				font-weight: 500;
			}

			.text {
				color: var(--vt-sub-black);
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
				background: #387EFF;
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
				color: var(--vt-header-black);
				font-weight: 500;
			}

			.text {
				color: #387EFF;
			}
		}

		.copy-box {
			display: flex;
			align-items: center;
			background: rgba(130, 169, 249, 0.1);
			border: 2px dashed #387EFF;
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
					color: #387EFF;
					white-space: nowrap;
				}
			}
		}

		.receive-title {
			color: var(--vt-sub-black);
			font-weight: 500;
			padding: 30px 0;
		}

		.withdrawal-text {
			font-size: 25px;
			display: flex;
			justify-content: space-between;
			margin-top: 48px;

			.title {
				color: var(--vt-header-black);
				font-weight: 500;
				margin-right: 20px;
			}

			.text {
				display: flex;

				span {
					color: #387EFF;
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
				border-radius: 12px;
				border-top: 1.5px solid #FFF;
				background: linear-gradient(270deg, rgba(153, 153, 153, 0.30) 0%, rgba(255, 255, 255, 0.30) 100%);
				box-shadow: 0px 2px 4.4px 0px rgba(0, 0, 0, 0.15);
			}
		}

		.rate-box {
			font-size: 26px;
			color: #121212;
			text-align: center;
			margin-top: 40px;

			span {
				color: #387EFF;
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
				border-top: 1.5px solid #FFF;
				background: linear-gradient(270deg, rgba(153, 153, 153, 0.30) 0%, rgba(255, 255, 255, 0.30) 100%);
				box-shadow: 0px 2px 4.4px 0px rgba(0, 0, 0, 0.15);
				border-radius: 13px;

				.van-field__right-icon {
					color: var(--vt-header-black);
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
		background: transparent;

		.Borrow {
			//margin-top: 40px;
			width: 100%;

			:deep .van-button--normal {
				width: 100%;
				border-radius: 30px;
				height: 56px;
				background-image: url("@/assets/images/market/p_button.png");
				background-position:  center;
				background-size: 110% 130%;
				border:none;
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
