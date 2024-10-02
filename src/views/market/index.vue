<template>
	<div class="market_container">
		<div class="header">{{ t('市场') }}</div>
		<div class="market_list">
			<div class="list_info">
				<div class="item" v-for="(item, index) in coinList" :key="index" @click="popupShow(item)">
					<div class="item_img" v-if="item && item.productLogPath">
						<img :src="$imgpath + item.productLogPath" alt="" />
					</div>
					<div class="coin">
						<div class="name">{{ item.productName }}</div>
						<div>{{ item.productFullname }}</div>
					</div>
					<div class="echarts">
						<EchartsLine :line-id="item.productName || `line-${index}`" :row-data="item" />
						<!-- <img src="../../assets/images/home/echarts.png" alt="echarts" /> -->
					</div>
					<MarketLatestData :row-data="item" />
				</div>
				<!-- kline -->
				<div class="parent-dialog">
					<el-dialog v-model="centerDialogVisible" width="350" align-center class="popup-css" @closed="klinecClosed">
						<template #header>
							<div class="dialog-title">
								<img @click="centerDialogVisible = false" src="@/assets/images/market/back.png" class="back-css" alt="" />
								<span class="title-text">{{ marketEachData.productName }}</span>
								<img src="@/assets/images/market/back.png" class="back-css" style="visibility: hidden" alt="" />
							</div>
						</template>
						<div class="charts-top">
							<div class="coin-info">
								<!-- {{marketEachData}} -->
								<div class="coin-row">
									<div class="coin-left">
										<img :src="$imgpath + marketEachData.productLogPath" class="coin-css" alt="" />
										<!-- <img src="../../assets/images/market/back-arrow.png" class="coin-css" alt="" /> -->
										<div class="coin-name">
											<p class="name">{{ marketEachData.productName }}</p>
											<p>{{ marketEachData.productFullname }}</p>
										</div>
									</div>
									<div class="coin-right">
										<p class="coin-price">{{ symbolInfo.closePlain || symbolInfo.close }}</p>
										<p class="coin-percent" :class="{ red: symbolInfo.dailyChange < 0 }">
											{{ symbolInfo.dailyChange > 0 ? '+' : '' }}{{ symbolInfo.dailyChange || '--' }}%
										</p>
									</div>
								</div>
							</div>
							<div class="open-high">
								<div>
									<p class="high-txt">{{ t('开盘价') }}</p>
									<p class="num-txt">{{ symbolInfo.open }}</p>
								</div>
								<div>
									<p class="high-txt">{{ t('最高价') }}</p>
									<p class="num-txt">{{ symbolInfo.high }}</p>
								</div>
								<div>
									<p class="high-txt">{{ t('最低价') }}</p>
									<p class="num-txt">{{ symbolInfo.low }}</p>
								</div>
								<div>
									<p class="high-txt">{{ t('收盘价') }}</p>
									<p class="num-txt">{{ symbolInfo.close }}</p>
								</div>
							</div>
							<div class="measure-block measure-block1">
								<p
									class="measure"
									:class="{ 'active-measure': item.key === klineType }"
									v-for="item in klineTypeList"
									:key="item.key"
									@click="checkKlineType(item)"
								>
									{{ item.value }}
								</p>
							</div>
						</div>
						<div>
							<EchartsMarket ref="echartsMarketRef" :kline-data="klineHistoryList" :symbol-info="symbolInfo" />
							<!-- <img src="../../assets/images/market/pie-chart.png" class="pie-css" alt="pie icon"> -->
							<!-- <div class="date-time">
								<p>07/28 04:30</p>
								<p>07/28 09:30</p>
								<p>07/28 13:30</p>
								<p>07/28 17:30</p>
							</div> -->
						</div>
						<template #footer>
							<div class="dialog-footer" v-if="isProductfinalconfig">
								<el-button class="up-btn" @click="popupFromLower('0')">{{ t('上涨') }}</el-button>
								<el-button class="down-btn" @click="popupFromLower('1')">{{ t('下跌') }}</el-button>
							</div>
						</template>
					</el-dialog>
				</div>
				<!-- 合约 -->
				<div class="child-dialog">
					<el-dialog
						ref="childDialogRef"
						v-model="childDialogVisible"
						:close-on-click-modal="true"
						width="350"
						align-center
						class="popup-css"
						:class="{ bg: optionStatus === 'pending' }"
					>
						<div class="line-css" @click.stop @close="childDialogClose">
							<div class="parentcss">
								<div class="commontab normalcss" :class="{ activecss: selectTab == 'option' }" @click="tabFunc('option')">{{ t('期权') }}</div>
								<div class="commontab normalcss" :class="{ activecss: selectTab == 'contract' }" @click="tabFunc('contract')">{{ t('合约') }}</div>
							</div>
							<div class="coin-row">
								<div class="coin-left">
									<img :src="$imgpath + marketEachData.productLogPath" class="coin-css" alt="" @click="childDialogVisible = false" />
									<div class="coin-name">
										<p class="name">{{ marketEachData.productName }}</p>
										<p>{{ marketEachData.productFullname }}</p>
									</div>
								</div>
								<div class="coin-right">
									<p class="coin-price">${{ symbolInfo.closePlain || symbolInfo.close }}</p>
									<p class="coin-percent" :class="{ up: symbolInfo.dailyChange > 0 }">
										{{ symbolInfo.dailyChange > 0 ? '+' : '' }}{{ symbolInfo.dailyChange }}%
									</p>
								</div>
							</div>
						</div>
						<div v-if="selectTab == 'option'">
							<p class="time-css">{{ t('时间') }}</p>
							<template v-if="optionStatus === 'wait'">
								<div class="scroll-container">
									<div class="measure-block measure-block2">
										<div
											v-for="(list, index) in prodFinalList"
											class="each-measure"
											:key="index"
											:class="selectProductFinalConfig.id == list.id ? 'activeTime' : ''"
											@click="prodActiveFunc(list)"
										>
											<p class="upper-txt">{{ list.time }} s</p>
											<p class="lower-txt">Ror:{{ timesForValueDecimal(list.odds, 100) }}%</p>
										</div>
									</div>
								</div>
								<div class="trans-div">
									<p class="transaction-css">{{ t('交易费') }}:</p>
									<p class="transaction-amount">$ {{ timesForValueDecimal(marketEachData.feeRatio, numVal) }}</p>
								</div>
								<div class="money-num">
									<!-- margin = (lots * oneAmount)/leverage -->
									<!-- {{selectCoinOption}}-{{coinOptions[selectCoinOption].label}} -->
									<el-select v-model="selectCoinOption" placeholder="Select" class="wallet-select" popper-class="wallet-select-popper">
										<el-option v-for="item in coinOptions" :key="item.value" :label="item.label" :value="item.value">
											<template #default="{ option }">
												<div class="custom-option">
													<img :src="item.image" alt="" class="option-image" />
													<span class="option-text">{{ item.label }}</span>
												</div>
											</template>
										</el-option>
										<template #prefix>
											<img :src="coinOptions[selectCoinOption].image" alt="" class="image2" />
										</template>
									</el-select>
									<!-- <div class="money-block">
									<img src="../../assets/images/market/money-sign.png" class="sign-css" alt="money sign">
									<span class="money-css">USDC</span>
									</div> -->
									<div class="step-input">
										<el-input-number v-model="numVal" :min="0" class="custom-input-number" @blur="formatterNumVal" />
									</div>
								</div>
								<div class="trans-div trans-div2">
									<p class="transaction-css">{{ t('可用余额') }}:</p>
									<p class="transaction-amount">{{ plusDecimal(foundObject.balance || 0) }} {{ foundObject.coinCode || '' }}</p>
								</div>
							</template>
							<template v-if="optionStatus === 'pending'">
								<div class="countdown" v-if="optionOrderData && optionOrderData.period">
									<template v-if="optionOrderProgress !== 100">
										<div class="des">
											<p class="p1"><van-count-down :time="optionOrderData.period * 1000" format="ss" @change="countDownChange" /> s</p>
											<p class="p2">ROI:{{ selectProductFinalConfig.odds * 100 }}%</p>
										</div>
										<div class="progress">
											<van-progress :percentage="optionOrderProgress" :show-pivot="false" track-color="#F4F4F4" color="82A9F9" stroke-width="8px" />
										</div>
									</template>
									<div v-else class="num" :class="{ up: expectedSymbol === '+' }">{{ expectedSymbol }}{{ optionOrderData.lossAmountPrice }}$</div>
								</div>
								<div class="statics-block" v-if="optionOrderData && optionOrderData.orderAmount">
									<div class="item1">
										<span class="p1">{{ t('金额') }}</span>
										<span class="p2 ellipsis">$ {{ optionOrderData.orderAmount }}</span>
									</div>
									<div class="item1">
										<span class="p1">{{ t('费用') }}</span>
										<span class="p2 ellipsis">$ {{ optionOrderData.transactionFee }}</span>
									</div>
									<div class="item1">
										<span class="p1">{{ t('当前价格') }}</span>
										<span class="p2 ellipsis">{{ optionOrderData.closePrice || symbolInfo.close }}</span>
									</div>
									<div class="item1">
										<span class="p1">{{ t('开盘价格') }}</span>
										<span class="p2 ellipsis">{{ optionOrderData.openPrice || symbolInfo.open }}</span>
									</div>
									<div class="item1">
										<span class="p1">{{ t('预期') }}</span>
										<span class="p2 ellipsis">{{ expectedSymbol }} ${{ optionOrderData.lossAmountPrice }}</span>
									</div>
									<div class="item1">
										<span class="p1">{{ t('类型') }}</span>
										<span class="p2 ellipsis">{{ priceChanDir === '0' ? t('上涨') : t('下跌') }}</span>
									</div>
								</div>
							</template>
						</div>

						<div v-else-if="selectTab == 'contract'">
							<div class="block1">
								<span class="demonstration">{{ t('杠杆') }}: {{ leverageVal }}X</span>
								<el-slider v-model="leverageVal" :min="1" :max="marketEachData.leverageTimes" show-stops :marks="marks"> </el-slider>
							</div>
							<div class="money-num money-num2">
								<!-- {{selectContractCoin}}-{{coinOptions[selectContractCoin].label}} -->
								<el-select v-model="selectContractCoin" placeholder="Select" class="wallet1-select">
									<el-option v-for="item in coinOptions" :key="item.value" :label="item.label" :value="item.value">
										<template #default="{ option }">
											<div class="custom-option">
												<img :src="item.image" alt="icon" class="option-image" />
												<span class="option-text">{{ item.label }}</span>
											</div>
										</template>
									</el-option>
									<template #prefix>
										<img :src="coinOptions[selectContractCoin].image" alt="" class="image3" />
									</template>
								</el-select>
							</div>
							<div class="swit-row">
								<p>{{ t('限价委托') }}</p>
								<el-switch v-model="tradeTypeSwitchVal" size="large" active-color="#13ce66" inactive-color="#ff4949" @change="tradeTypeChange">
								</el-switch>
							</div>
							<div class="price-block">
								<p class="buyprice">{{ t('买入价') }}</p>
								<div class="buy-row">
									<p class="numcss" v-if="!tradeTypeSwitchVal">{{ symbolInfo.closePlain || symbolInfo.close }}</p>
									<van-field class="numcss" v-else v-model="tradeOpeningPrice" center placeholder=""></van-field>
									<p>{{ marketEachData.productName }}</p>
								</div>
							</div>
							<div>
								<p class="buyprice">{{ t('买入手数') }}</p>
								<div class="buy-volume">
									<!-- <p>{{ buyVolAmount }}</p> -->
									<van-field
										v-model="buyVolAmount"
										:formatter="formatterBuyVolAmount"
										format-trigger="onBlur"
										type="digit"
										center
										placeholder=""
									></van-field>
									<div class="incre-decre">
										<p class="numbtn padcss" @click="decreIncreFunc('minus')">-10</p>
										<p class="numbtn" @click="decreIncreFunc('plus')">+10</p>
									</div>
								</div>
								<div class="margin-commission">
									<!-- margin = (lots * oneAmount)/leverage  margin = oneAmount*purchaseLots/leverageRatio  -->
									<p>{{ t('所需保证金') }}:{{ marginAmount }}</p>
									<p>{{ t('手续费') }}:{{ timesForValueDecimal(marginAmount, marketEachData.feeRatio) }}</p>
								</div>
							</div>
							<div class="swit-row">
								<p>{{ t('设置止盈/止损') }}</p>
								<el-switch
									v-model="takeProfitStopLossSwitchVal2"
									size="large"
									active-color="#13ce66"
									inactive-color="#ff4949"
									@change="takeProfitStopLossChange"
								>
								</el-switch>
							</div>
							<div v-if="takeProfitStopLossSwitchVal2" class="profit-stop">
								<div class="profitcss">
									<p>{{ t('止盈价') }}</p>
									<el-input placeholder="" v-model="profitPrice"></el-input>
								</div>
								<div class="losscss">
									<p>{{ t('止损价') }}</p>
									<el-input placeholder="" v-model="stoplossPrice"></el-input>
								</div>
							</div>
						</div>
						<template #footer>
							<div class="dialog-footer">
								<template v-if="selectTab == 'option'">
									<el-button v-if="optionStatus === 'wait'" class="buy-btn" :class="{ 'down-btn': priceChanDir === '1' }" @click="buyupFunc()">{{
										priceChanDir === '0' ? t('买涨') : t('买跌')
									}}</el-button>
									<el-button v-else class="buy-btn" @click="continueHandle">{{ t('继续') }}</el-button>
								</template>
								<el-button v-else-if="selectTab == 'contract'" class="buy-btn" @click="addContractFunc()">{{ t('确认') }}</el-button>
							</div>
						</template>
					</el-dialog>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BTC from '@/assets/images/home/BTC.png'
import {
	addContractOrder,
	clientgetPlatformClient,
	fetchProdFinalClientList,
	getCoinList,
	getOptionOrderDetailApi,
	getSymbolInfo,
	klieListApi,
	optionClientAdd,
} from '@/apiService'
import { userStore } from '@/store'
import Socket from '@/utils/socket.js'
import EchartsMarket from './echartsMarket.vue'
import MarketLatestData from './marketLatestData.vue'
import EchartsLine from '@/views/market/echartsLine.vue'
import { showToast } from 'vant'
import { useI18n } from 'vue-i18n'
import useLoading from '@/hooks/useLoading.js'
import { onClickOutside } from '@vueuse/core'
import { dividedForValueDecimal, getImageUrl, plusDecimal, timesForValueDecimal } from '@/utils'

// 初始化仓库
const uStore = userStore()
const { t } = useI18n()
const loading = useLoading()

// 变量区
const router = useRouter()
const route = useRoute()
const priceChanDir = ref(undefined)
const profitPrice = ref('')
const stoplossPrice = ref('')
const leverageVal = ref(1)
const tradeTypeSwitchVal = ref(false)
const takeProfitStopLossSwitchVal2 = ref(false)
const selectProductFinalConfig = ref({})
const selectTab = ref('option')
const coinList = ref([])
const prodFinalList = ref([])
const platformaccount = ref([])
const marketEachData = ref({})
const centerDialogVisible = ref(false)
const childDialogVisible = ref(false)
const numVal = ref(0)
const buyVolAmount = ref(0)
const coinOptions = [
	{
		value: '0',
		label: 'USDC',
		image: getImageUrl('market/USDC.png'),
	},
	{
		value: '1',
		label: 'USDT',
		image: getImageUrl('market/USDT.png'),
	},
	// , {
	//   value: '0',
	//   label: 'BTC',
	//   image: '../../src/assets/images/market/BTC.png'
	// },
	// {
	//   value: '2',
	//   label: 'StETH',
	//   image: '../../src/assets/images/market/stETH.png'
	// }, {
	//   value: '3',
	//   label: 'AAVE',
	//   image: '../../src/assets/images/market/AAVE.png'
	// }, {
	//   value: '4',
	//   label: 'UNI',
	//   image: '../../src/assets/images/market/UNI.png'
	// }, {
	//   value: '5',
	//   label: 'DAI',
	//   image: '../../src/assets/images/market/DAI.png'
	// }, {
	//   value: '6',
	//   label: 'XAUT',
	//   image: '../../src/assets/images/market/TAUT.png'
	// }, {
	//   value: '7',
	//   label: 'RenBTC',
	//   image: '../../src/assets/images/market/RenBTC.png'
	// }, {
	//   value: '8',
	//   label: 'StkAAVE',
	//   image: '../../src/assets/images/market/stkAAVE.png'
	// }
]
const selectCoinOption = ref('0')
const selectContractCoin = ref('0')
const foundObject = ref({
	balance: '',
	coinCode: '',
})
const foundObjecContract = ref({})
// 市场列表
const list = ref([
	{
		title: 'BTC/USD11',
		text: 'Bitcoin',
		img: BTC,
	},
	{
		title: 'ETH/USD',
		text: 'Bitcoin',
		img: BTC,
	},
	{
		title: 'ATOM/USD',
		text: 'Bitcoin',
		img: BTC,
	},
	{
		title: 'LTC/USD',
		text: 'Bitcoin',
		img: BTC,
	},
	{
		title: 'BTC/USD',
		text: 'Bitcoin',
		img: BTC,
	},
	{
		title: 'LTC/USD',
		text: 'Bitcoin',
		img: BTC,
	},
])

// 保证金
const marginAmount = computed(() => {
	return dividedForValueDecimal(timesForValueDecimal(buyVolAmount.value, marketEachData.value.oneAmount), leverageVal.value) || 0
})

watch(
	() => selectCoinOption.value,
	(newValue, oldValue) => {
		console.log('Selected value changed from', oldValue, 'to', newValue)
		const labelToFind = coinOptions[selectCoinOption.value].label
		if (platformaccount.value && platformaccount.value.length > 0) {
			foundObject.value = platformaccount.value.find((obj) => obj.coinCode && obj.coinCode.toLowerCase() === labelToFind.toLowerCase())
		} else {
			foundObject.value = {
				balance: '0',
				coinCode: labelToFind.toLowerCase(),
			}
		}
	},
	{ immediate: true }
)
watch(
	() => selectContractCoin.value,
	(newValue, oldValue) => {
		console.log('Selected value changed from', oldValue, 'to', newValue)
		const labelToFind = coinOptions[selectContractCoin.value].label
		if (platformaccount.value && platformaccount.value.length > 0) {
			foundObjecContract.value = platformaccount.value.find((obj) => obj.coinCode && obj.coinCode.toLowerCase() === labelToFind.toLowerCase())
		} else {
			foundObjecContract.value = {
				balance: '0',
				coinCode: labelToFind.toLowerCase(),
			}
		}
	},
	{ immediate: true }
)

const popupShow = (data) => {
	marketEachData.value = data
	leverageVal.value = data.leverageTimes
	centerDialogVisible.value = true
	getSymbolInfoFun()
	resetData()
}
const childDialogRef = ref(null)
const handleCloseDialog = () => {
	onClickOutside(childDialogRef, (e) => {
		// console.log('click outside!', e);
		if (e?.target.className === 'el-overlay') {
			childDialogVisible.value = false
			childDialogClose()
		}
	})
}
const popupFromLower = (val) => {
	priceChanDir.value = val
	getProdFinalList()
	getPlatformList()
	childDialogVisible.value = true
	handleCloseDialog()
	resetData()
}
const childDialogClose = () => {
	console.log('childDialogClose')
	clearInterval(getOrderTimer.value)
	clearTimeout(toastTimer.value)
}
const decreIncreFunc = (val) => {
	if (val == 'minus' && buyVolAmount.value > 0) {
		buyVolAmount.value = buyVolAmount.value * 1 - 10
	} else if (val == 'plus') {
		buyVolAmount.value = buyVolAmount.value * 1 + 10
	}
}
const getPlatformList = async () => {
	try {
		loading.loading()
		const response = await clientgetPlatformClient()
		loading.clearLoading()
		platformaccount.value = response.data
		const labelToFindO = coinOptions[selectCoinOption.value].label
		const labelToFindC = coinOptions[selectContractCoin.value].label

		// console.log('dddsssss', labelToFindO, labelToFindC, foundObject, foundObjecContract)
		if (response.data && response.data.length > 0) {
			foundObject.value = response.data.find((obj) => obj.coinCode && obj.coinCode.toLowerCase() === labelToFindO.toLowerCase())
			foundObjecContract.value = response.data.find((obj) => obj.coinCode && obj.coinCode.toLowerCase() === labelToFindC.toLowerCase())
		} else {
			foundObject.value = {
				balance: '0',
				coinCode: labelToFindO.toLowerCase(),
			}
			foundObjecContract.value = {
				balance: '0',
				coinCode: labelToFindC.toLowerCase(),
			}
		}
	} catch (err) {
		console.log(err)
	}
}
// 杠杆
const marks = computed(() => {
	let obj = {}
	if (marketEachData.value?.leverageTimes) {
		let leverageTimes = marketEachData.value.leverageTimes * 1
		obj = {
			1: '1X',
		}
		obj[Math.ceil(leverageTimes / 4)] = `${Math.ceil(leverageTimes / 4)}X`
		obj[Math.ceil((leverageTimes * 2) / 4)] = `${Math.ceil((leverageTimes * 2) / 4)}X`
		obj[Math.ceil((leverageTimes * 3) / 4)] = `${Math.ceil((leverageTimes * 3) / 4)}X`
		obj[leverageTimes] = `${leverageTimes}X`
	} else {
		obj = {
			1: '1X',
			125: '125X',
			250: '250X',
			375: '375X',
			500: '500X',
		}
	}
	return obj
})
// 买入 手数格式化
const formatterBuyVolAmount = (value) => {
	// val = val.replace(/\d/g, '')
	return `${Math.round(parseFloat(value) / 10) * 10}`
}
// 期权买入金额格式化
const formatterNumVal = (e) => {
	console.log('ddd', e)
	let match = e.target.value.match(/^\d+$/)
	e.target.value = match ? parseInt(match[0], 10) : 0
	numVal.value = e.target.value * 1
}
// wait pending confirm
const optionStatus = ref('wait')
const optionOrderData = ref({
	orderAmount: '',
	transactionFee: '',
	period: '',
	id: '',
})
const buyupFunc = () => {
	if (numVal.value * 1 <= 0) {
		showToast({ message: t('金额输入有误，请输入大于0的金额'), icon: 'info' })
		return
	}
	if (!selectProductFinalConfig.value.encryCoinId || !selectProductFinalConfig.value.id) {
		return showToast({ message: t('产品期权配置信息异常'), icon: 'info' })
	}
	if (numVal.value > foundObject.value.balance) {
		showToast({ message: t('操作失败，您的代币余额不足'), icon: 'info' })
		return
	}

	let data = {
		priceChangeDirection: priceChanDir.value,
		orderAmount: numVal.value,
		optionConfigurationId: selectProductFinalConfig.value.id,
		orderCurrency: coinOptions[selectCoinOption.value].label,
		encryCoinId: selectProductFinalConfig.value.encryCoinId,
		openPrice: symbolInfo.value.close,
		coinSymbol: marketEachData.value.productName,
	}
	addOption(data)
}
const addOption = async (data) => {
	try {
		loading.loading()
		const res = await optionClientAdd(data)
		loading.clearLoading()
		// optionOrderData.value.period = 60
		// optionStatus.value = 'pending'
		console.log('addOption', res)
		showToast({ message: t('成功'), icon: 'info' })
		if (res?.data) {
			const { orderAmount, transactionFee, id } = res.data
			optionStatus.value = 'pending'
			optionOrderData.value = {
				orderAmount: orderAmount || numVal.value,
				transactionFee: transactionFee || marketEachData.value.feeRatio * numVal.value,
				period: selectProductFinalConfig.value.time,
				lossAmountPrice: (orderAmount * selectProductFinalConfig.value.odds).toFixed(4),
				id: id,
			}
		} else {
			optionStatus.value = 'pending'
			optionOrderData.value = {
				orderAmount: numVal.value,
				transactionFee: marketEachData.value.feeRatio * numVal.value,
				period: selectProductFinalConfig.value.time,
				id: '',
			}
		}

		updateBalance()
		computedExpectedPrice(optionOrderData.value)
	} catch (err) {
		console.log(err)
	}
}
// 倒计时
const optionOrderProgress = ref(0)
const countDownChange = (time) => {
	// console.log('dddd', time, optionOrderProgress.value)
	// || optionOrderProgress.value >= 100
	if (time.total && time.seconds === 0) {
		optionOrderProgress.value = 100
		getOptionOrderDetail(optionOrderData.value.id)
	} else {
		// optionOrderProgress.value += Number(Math.floor(100 / optionOrderData.value.period))
		// if (optionOrderProgress.value < 50) {
		// 	optionOrderProgress.value = (optionOrderProgress.value % 100) + 4
		// }
		optionOrderProgress.value = Number(Math.round(((optionOrderData.value.period - time.seconds) / optionOrderData.value.period) * 100))
	}
}
// 获取订单详情
const getOrderTimer = ref(null)
const getOptionOrderDetail = async (id) => {
	try {
		if (!id) return
		loading.loading()
		const res = await getOptionOrderDetailApi(id)
		loading.clearLoading()
		// console.log('getOptionOrderDetail', res)
		if (res.data) {
			if (res.data.lossAmountPrice == null || res.data.closePrice == null) {
				clearInterval(getOrderTimer.value)
				getOrderTimer.value = setInterval(() => {
					getOptionOrderDetail(optionOrderData.value.id)
				}, 2000)
			} else {
				clearInterval(getOrderTimer.value)
				optionOrderData.value.lossAmountPrice = res.data.lossAmountPrice
				optionOrderData.value.openPrice = res.data.openPrice
				optionOrderData.value.closePrice = res.data.closePrice
				optionOrderData.value.orderNo = res.data.orderNo
				computedExpectedPrice(optionOrderData.value)
			}
		}
		optionStatus.value = 'pending'
	} catch (err) {
		console.log(err)
		clearInterval(getOrderTimer.value)
	} finally {
		loading.clearLoading()
	}
}
const continueHandle = () => {
	optionStatus.value = 'wait'
	childDialogVisible.value = false
	// router.push('/records?tab=3')
	resetData()
}

const toastTimer = ref(null)
const addContractFunc = async (data) => {
	// Required Margin=Buy Volume/Leverage*Lots
	// 永续合约的盈亏金额=（平仓价 - 入仓价）*一手数量 * 手数*杠杆倍数
	// 保证金=一手金额➗杠杆倍数✖️手数
	// 手续费=保证金*手续费比率

	if (buyVolAmount.value * 1 <= 0) {
		showToast({ message: t('输入有误，请输入大于0的手数'), icon: 'info' })
		return
	}

	let temp = {
		priceChangeDirection: priceChanDir.value,
		baseSymbol: foundObjecContract.value.coinCode,
		tradeOpeningPrice: tradeOpeningPrice.value,
		leverageRatio: leverageVal.value > 0 ? leverageVal.value : 1,
		tradeType: tradeTypeSwitchVal.value == true ? '1' : '0',
		encryCoinId: prodFinalList.value[0].encryCoinId,
		purchaseLots: buyVolAmount.value,
		takeProfitPrice: profitPrice.value,
		stopLossPrice: stoplossPrice.value,
		takeProfitStopLoss: takeProfitStopLossSwitchVal2.value,
		coinSymbol: marketEachData.value.productName,
	}
	try {
		loading.loading()
		const res = await addContractOrder(temp)
		loading.clearLoading()
		clearTimeout(toastTimer.value)
		toastTimer.value = setTimeout(() => {
			showToast({ message: t('成功'), icon: 'info' })
		}, 1000)
		updateBalance()
	} catch (err) {
		console.log(err)
	}
}
const prodActiveFunc = (val) => {
	// console.log('Shal Shal ', val)
	selectProductFinalConfig.value = val
}

const tabFunc = (val) => {
	selectTab.value = val
	resetData()
}
// 设置止盈止损
// 比如用户买跌，要判断止盈价格需要小于买入价格，止跌价格大于买入价格。
// 比如用户买涨，要判断止盈价格需要大于买入价格，止跌价格小于买入价格。
const takeProfitStopLossChange = (val) => {
	if (val) {
		if (priceChanDir.value === '1') {
			profitPrice.value = (symbolInfo.value.close * 1 * 0.9).toFixed(2)
			stoplossPrice.value = (symbolInfo.value.close * 1 * 1.1).toFixed(2)
		} else {
			profitPrice.value = (symbolInfo.value.close * 1 * 1.1).toFixed(2)
			stoplossPrice.value = (symbolInfo.value.close * 1 * 0.9).toFixed(2)
		}
	}
}
const tradeOpeningPrice = ref('')
const tradeTypeChange = (val) => {
	// console.log('tradeTypeChange', val)
	if (val) {
		tradeOpeningPrice.value = symbolInfo.value.closePlain * 1
	} else {
		tradeOpeningPrice.value = symbolInfo.value.closePlain * 1
	}
}
// 代码区
const getMarketList = async () => {
	try {
		loading.loading()
		const res = await getCoinList()
		loading.clearLoading()
		coinList.value = res.data
	} catch (err) {
		console.log(err)
	}
}
// 最近行情数据
const symbolInfo = ref({
	close: 0,
	dailyChange: 0,
	high: 0,
	low: 0,
	open: 0,
})
const getSymbolInfoFun = async () => {
	try {
		const symbol = marketEachData.value.productCode || 'btcusdt'
		loading.loading()
		const res = await getSymbolInfo(symbol)
		loading.clearLoading()
		if (res.data) {
			symbolInfo.value = res.data
		}
		klieList()
	} catch (err) {
		console.log(err)
	}
}
const isProductfinalconfig = ref(true)
const getProdFinalList = async () => {
	try {
		loading.loading()
		const res = await fetchProdFinalClientList({ encryCoinId: marketEachData.value.id })
		loading.clearLoading()

		if (res.data.length === 0) {
			isProductfinalconfig.value = true
			return showToast({ message: t('产品期权配置信息异常'), icon: 'info' })
		}

		prodFinalList.value = res.data
		selectProductFinalConfig.value = res.data[0]
		optionOrderData.value.period = res.data[0].time
	} catch (err) {
		console.log(err)
	}
}
// 更新可用余额
const updateBalance = () => {
	getPlatformList()
}
// 现在的价格比下单价格高：买涨，就是正盈利，买跌就说负盈利。现在的价格比下单价格低：买涨，就是负盈利，买跌就说正盈利。盈利计算公式：+/-(amount*roi）
const expectedSymbol = ref('')
const computedExpectedPrice = (order) => {
	expectedSymbol.value = ''
	if (order?.orderNo) {
		expectedSymbol.value = order.lossAmountPrice * 1 >= 0 ? '+' : ''
	} else {
		if (priceChanDir.value === '0') {
			expectedSymbol.value = symbolInfo.value.close * 1 >= symbolInfo.value.open * 1 ? '+' : '-'
		} else {
			expectedSymbol.value = symbolInfo.value.close * 1 >= symbolInfo.value.open * 1 ? '-' : '+'
		}
	}
}

// 重置数据
const resetData = () => {
	numVal.value = 0
	buyVolAmount.value = 0
	profitPrice.value = ''
	stoplossPrice.value = ''
	optionOrderProgress.value = 0
	tradeOpeningPrice.value = symbolInfo.value.closePlain || symbolInfo.value.close
	optionStatus.value = 'wait'
	optionOrderData.value = {
		orderAmount: '',
		transactionFee: '',
		period: '',
		id: '',
	}
}

// kline
const klineType = ref('5m')
const klineTypeList = [
	{
		key: '5m',
		value: '5M',
	},
	{
		key: '30m',
		value: '30M',
	},
	{
		key: '1h',
		value: '1H',
	},
	{
		key: '1d',
		value: '1D',
	},
	{
		key: '1w',
		value: '1W',
	},
]
const checkKlineType = (item) => {
	klineType.value = item.key
	klieList()
}

// kline线历史数据
const klineHistoryList = ref([])
const echartsMarketRef = ref(null)
const klieList = async () => {
	try {
		const params = {
			pageNum: 1,
			pageSize: 100,
			symbol: marketEachData.value.productName,
			type: klineType.value,
		}
		loading.loading()
		const res = await klieListApi(params)
		loading.clearLoading()
		// console.log('klieList ', res.data)
		klineHistoryList.value = res.data?.records.slice().reverse() || []
		await nextTick()
		echartsMarketRef.value && echartsMarketRef.value.updateChart(res.data?.records.slice().reverse() || [])

		getSocket()
	} catch (err) {
		console.log(err)
	}
}
// 获取最新数据
const klineListSocket = ref(null)
const getSocket = () => {
	closeSoecket()

	// symbol
	const symbol = marketEachData.value.productName.replace('/', '-') || 'BTC-USD'
	// 5m 30m 1h 1d 1w
	const type = klineType.value
	const url = `/ws/kline/${symbol}/${type}`
	klineListSocket.value = new Socket(url)
	klineListSocket.value.init()
	klineListSocket.value.websocket.onmessage = (e) => {
		// console.log('getSocket----', e.data)

		if (typeof e.data === 'string') {
			let message = JSON.parse(e.data)
			if (klineHistoryList.value.length > 300) {
				klineHistoryList.value = klineHistoryList.value.slice(100)
			}
			symbolInfo.value = message
			const targetIndex = klineHistoryList.value.findIndex((item) => item.unixTime === message.unixTime)
			// console.log('targetIndex----', targetIndex)
			if (typeof targetIndex === 'number' && targetIndex !== -1) {
				klineHistoryList.value.splice(targetIndex, 1, message)
				// console.log('ddd', klineHistoryList.value)
			} else {
				klineHistoryList.value.push(message)
			}
			nextTick(() => {
				echartsMarketRef.value && echartsMarketRef.value.updateChart(klineHistoryList.value)
			})
		}
	}
}
// 关闭k线
const klinecClosed = () => {
	closeSoecket()
}
// 清除socket
const closeSoecket = () => {
	klineListSocket.value && klineListSocket.value.close()
}

onMounted(() => {
	getMarketList()
	// getProdFinalList()
})

onUnmounted(() => {
	closeSoecket()
	clearInterval(getOrderTimer.value)
	clearTimeout(toastTimer.value)
})

// 将组件中的数据进行暴露出去
defineExpose({})
</script>

<style lang="scss" scoped>
.market_container {
	// position: relative;
	height: 100%;
	padding: 42px 42px 0;
	//background: #f5f5f5;
	background-color: #fff;

	.header {
		height: 80px;
		font-size: 48px;
		font-weight: 700;
		color: #121212;
	}

	.market_list {
		margin-top: 48px;
		padding-bottom: 48px;
		font-size: 36px;
		//padding: 0 20px;
		//background: #fff;
		//border-radius: 32px;
		overflow-y: scroll;
		height: calc(100% - 120px);

		.list_info {
			.item {
				display: flex;
				border-bottom: 1px solid #f1f3f7;
				font-size: 25px;
				padding-bottom: 32px;
				margin-top: 32px;

				.item_img {
					flex: 0 0 96px;
					width: 90px;
					height: 90px;
					border-radius: 50%;
					margin-right: 32px;
					overflow: hidden;

					img {
						width: 100%;
						height: 100%;
					}
				}

				.coin {
					flex: 0 0 140px;
					color: #bbb;
					font-size: 24px;
					margin-right: 52px;

					.name {
						font-size: 28px;
						font-style: normal;
						font-weight: 700;
						color: #121212;
						margin-top: 8px;
					}
				}

				.echarts {
					width: 150px;
					height: 80px;

					img {
						width: 100%;
						height: 100%;
					}
				}

				.num {
					flex: 1 1 auto;
					margin-left: 40px;
					max-width: 140px;
					text-align: right;

					div {
						width: 100%;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}

					.price {
						font-size: 32px;
						color: #121212;
						font-weight: 700;
					}

					.trend {
						color: #7ba9ff;
						font-size: 24px;
						font-weight: 400;
					}

					.red {
						color: #ff6464;
					}
				}
			}

			.parent-dialog {
				text-align: center;

				.dialog-title {
					.back-css {
						width: 48px;
						height: 48px;
					}
				}

				.charts-top {
					background: #f5f5f5;
					// border-radius: 32px;
					padding: 20px 26px;
				}

				.coin-info {
					padding: 0 50px 24px 10px;
				}

				.coin-row {
					.coin-left {
						.coin-css {
							width: 90px;
							height: 90px;
							border-radius: 50%;
						}

						.coin-name {
							font-size: 28px;
							font-weight: 500;
							margin-left: 20px;
							color: #c0c0c0;

							.name {
								font-size: 28px;
								font-weight: 600;
								margin-top: 10px;
								color: #000;
							}
						}
					}

					.coin-right {
						.coin-price {
							font-size: 30px;
							font-weight: 700;
							color: #292d32;
							text-align: right;
						}

						.coin-percent {
							color: #7ba9ff;
							font-size: 30px;
							font-weight: 400;
							text-align: right;
						}

						.red {
							color: #e8503a;
						}
					}
				}

				.open-high {
					padding: 0 44px;

					.high-txt {
						color: #999;
						font-size: 24px;
						font-weight: 500;
						color: #c0c0c0;
					}

					.num-txt {
						color: #292d32;
						font-size: 30px;
						font-weight: 400;
						margin-top: 10px;
					}
				}

				.btn-css {
					color: #fff;
					height: 52px;
					background: #1d2a5e;
					border-radius: 26px;
					width: 60%;
				}

				.btn-css:focus {
					background: #1d2a5e;
				}

				.waning-css {
					width: 24px;
					height: 24px;
				}

				.title-text {
					color: #121212;
					font-size: 40px;
					font-weight: 700;
				}

				.dialog-footer {
					display: flex;
					justify-content: space-between;

					.up-btn {
						color: #fff;
						border-radius: 24px;
						flex: 1;
						font-size: 28px;
						height: 80px;
						background: #7ba9ff;
						margin-right: 28px;
					}

					.down-btn {
						color: #fff;
						border-radius: 24px;
						flex: 1;
						font-size: 28px;
						height: 80px;
						background: #e8503a;
					}
				}
			}
		}
	}
}
</style>
<style lang="scss">
.parent-dialog {
	.pie-css {
		width: 100%;
	}

	.date-time {
		padding: 16px 32px;
		display: flex;
		justify-content: space-between;
		color: #858585;
		font-size: 12px;
		font-weight: 400;
	}

	.el-dialog__headerbtn {
		display: none;
	}

	.el-dialog {
		width: 100vw;
		min-height: 100vh;
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		border-radius: 0;
	}

	.el-dialog__body {
		margin: 0;
		width: 100%;
	}

	.el-dialog__header,
	.el-dialog__footer {
		width: 100%;
		padding: 40px 20px 20px;
		box-sizing: border-box;
	}

	.el-dialog__footer {
		padding: 40px 26px 20px;
		margin-top: 200px;
		background: #fff;
	}

	.dialog-title {
		display: flex;
		justify-content: space-around;
		align-items: center;
		width: 100%;
	}

	.coin-row {
		display: flex;
		justify-content: space-between;

		.coin-left {
			display: flex;
		}

		.coin-right {
			.coin-price {
				color: #292929;
				font-size: 30px;
				font-weight: 700;
			}

			.coin-percent {
				color: #658bf4;
				font-size: 30px;
				font-weight: 400;
			}
		}
	}

	.open-high {
		display: flex;
		justify-content: space-between;

		.high-txt {
			color: #c0c0c0;
			font-size: 12px;
			font-weight: 500;
		}

		.num-txt {
			color: #292929;
			font-size: 15px;
			font-weight: 400;
		}
	}

	.measure-block {
		display: flex;
		justify-content: space-around;
		border-radius: 18px;
		background: #e5e5e5;
		padding: 8px;
		margin-top: 20px;
		margin-bottom: 10px;

		.measure {
			position: relative;
			flex: 1;
			padding: 10px 20px;
			color: #000;
			font-size: 26px;

			&::after {
				content: '';
				position: absolute;
				right: 0;
				top: 50%;
				width: 2px;
				height: 24px;
				margin-top: -12px;
				border-left: 1px solid rgba($color: #8e8e93, $alpha: 0.3);
			}
		}

		.active-measure {
			border-radius: 10px;
			background: #fff;
			border-radius: 14px;
			font-weight: 590;
			color: #7ba9ff;
			border: 0.5px solid rgba(0, 0, 0, 0.04);
			box-shadow: 0px 3px 8px 0px rgba(0, 0, 0, 0.12), 0px 3px 1px 0px rgba(0, 0, 0, 0.04);
		}
	}

	.back-css {
		width: 40px;
	}

	.coin-css {
		width: 45px;
	}

	.coin-name {
		color: #000;
		font-weight: 600;
		font-size: 14px;
		text-align: left;
		margin-left: 16px;
	}
}

.child-dialog {
	.el-dialog__headerbtn {
		// display: none;
		right: 10px;
		top: 10px;
	}

	.el-overlay-dialog {
		bottom: 0;
		border-radius: 32px 32px 0px 0px;
		background: #fff;
		top: unset;
	}

	.el-dialog {
		width: 100vw;
		margin: 0;
		padding: 0;
		height: 1200px;
		box-sizing: border-box;
		bottom: 0;
		overflow-y: scroll;
	}

	.bg {
		background: linear-gradient(180deg, #fff 14.81%, #ebf1fd 45%, #fff 87.05%);
	}

	.el-dialog__body {
		width: auto;
		margin: 0 26px;
	}

	.line-css {
		padding-bottom: 40px;
		border-bottom: 1px solid #d9d9d9;
	}

	.parentcss {
		display: flex;

		.commontab {
			margin-right: 16px;
		}

		.normalcss {
			background: #f1f2f2;
			border-radius: 35px;
			color: #000;
			padding: 0px 10px;
			width: 164px;
			height: 60px;
			line-height: 60px;
			display: flex;
			font-size: 28px;
			align-items: center;
			justify-content: center;
		}

		.activecss {
			background: #82a8f9;
			border-radius: 35px;
			color: #fff;
			padding: 0px 10px;
			width: 164px;
			height: 60px;
			line-height: 60px;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}

	.el-dialog__header,
	.el-dialog__footer {
		width: 100%;
		padding: 48px 20px 0;
		box-sizing: border-box;
	}

	.coin-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 40px;

		.coin-left {
			display: flex;
			align-items: center;
			padding-left: 20px;

			.coin-css {
				width: 90px;
				height: 90px;
				margin-right: 20px;
				border-radius: 50%;
			}

			.coin-name {
				font-size: 28px;
				font-weight: 500;
				color: #c0c0c0;

				.name {
					font-size: 28px;
					font-weight: 600;
					color: #000;
				}
			}
		}

		.coin-right {
			padding-right: 12px;

			.coin-price {
				color: #292929;
				font-size: 28px;
				font-weight: 700;
			}

			.coin-percent {
				color: #e8503a;
				font-size: 28px;
				font-weight: 400;
			}

			.up {
				color: #658bf4;
			}
		}
	}

	.time-css {
		color: #292d32;
		font-size: 28px;
		font-weight: 700;
		margin-top: 28px;
		margin-bottom: 26px;
	}

	.countdown {
		border-radius: 20px;
		background: #fff;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 36px 36px 30px 46px;
		margin-bottom: 24px;

		.des {
			flex: 1;
			margin-right: 64px;

			.p1 {
				color: #292929;
				font-size: 30px;
				font-weight: 500;
				margin-bottom: 6px;
				display: flex;
				align-items: center;

				.van-count-down {
					margin-right: 3px;
				}
			}

			.p2 {
				color: #a9aaab;
				font-size: 24px;
				font-weight: 500;
			}
		}

		.progress {
			flex: 3;
		}

		.num {
			width: 100%;
			color: #f46565;
			font-size: 26px;
			font-weight: 400;
			text-align: center;
		}

		.up {
			color: #7ba9ff;
		}
	}

	.statics-block {
		border-radius: 24px;
		background: #fff;
		padding: 40px;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 32px 34px;

		.item1 {
			display: flex;
			flex-direction: column;
			align-items: center;

			.p1 {
				color: #a9aaab;
				font-size: 24px;
				margin-bottom: 6px;
				font-weight: 500;
			}

			.p2 {
				color: #292929;
				font-size: 28px;
				font-weight: 500;
			}
		}
	}

	.scroll-container {
		white-space: nowrap;
		width: 100%;
		margin-bottom: 40px;
		padding-left: 20px;
		overflow-x: scroll;
		scroll-behavior: smooth;
	}

	.measure-block {
		display: flex;
		justify-content: space-around;
		border-radius: 8px;
		padding: 20px 0;
		overflow-x: scroll;
		scroll-behavior: smooth;
		padding-left: 20px;
		min-width: fit-content;

		.scroll-content {
			display: flex;
		}

		.each-measure {
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			border-radius: 24px;
			background: #fff;
			box-shadow: 0 0 62px #82a9f933;
			text-align: center;
			padding: 12px 8px 20px;
			flex: 0 0 140px;
			margin-right: 40px;
			width: 140px;
			height: 140px;

			.upper-txt {
				color: #222;
				font-size: 28px;
				font-weight: 700;
			}

			.lower-txt {
				color: #a9aaab;
				font-size: 24px;
				font-weight: 500;
				margin-top: 4px;
			}
		}

		.activeTime {
			border: 2px solid #82a9f9;
		}
	}

	.measure-block2 {
		overflow-y: auto;

		.each-measure {
		}
	}

	.measure-block::-webkit-scrollbar {
		display: none;
	}

	.measure-block::-webkit-scrollbar {
		display: none;
	}

	.measure-block {
		scrollbar-width: none;
	}

	.measure-block {
		-ms-overflow-style: none;
	}

	.trans-div {
		display: flex;
		justify-content: space-between;
		padding-left: 20px;

		.transaction-css {
			color: #a9aaab;
			font-size: 24px;
			font-weight: 400;
		}

		.transaction-amount {
			color: #658bf4;
			font-size: 26px;
			font-weight: 400;
		}
	}

	.money-num {
		display: flex;
		justify-content: space-between;
		margin-top: 26px;
		margin-bottom: 48px;
		width: 100%;
		padding-left: 20px;

		.wallet-select {
			flex: 1;
			overflow: hidden;
			margin-right: 64px;
			border-radius: 20px;
			height: 110px;
		}

		.wallet1-select {
			border: 0;
			height: 110px;

			.el-select__wrapper {
				height: 110px;
				border-radius: 20px;
				overflow: hidden;
				background: #f9fafc;
				border-color: transparent;
				box-shadow: none !important;
				outline: none;
			}
		}

		.step-input {
			flex: 1;
		}

		.custom-input-number {
			overflow: hidden;
			width: 100%;
			border-radius: 20px;
			height: 110px;

			.el-input-number__decrease {
				border-color: transparent;
				background: #f9fafc;

				.el-icon {
					background: #c7dbfe;
					color: #222222;
					border-radius: 8px;
					fill: #222222;
					width: 44px;
					height: 44px;
				}
			}

			.el-input-number__increase {
				border-color: transparent;
				background: #f9fafc;

				.el-icon {
					background: #c7dbfe;
					color: #222222;
					border-radius: 8px;
					fill: #222222;
					width: 44px;
					height: 44px;
				}
			}

			.el-input {
				border-radius: 16px;
				overflow: hidden;
				border-color: transparent;

				.el-input__wrapper {
					box-shadow: none;
					border-radius: 28px;
					background: #f9fafc;
					font-weight: 510;
				}
			}
		}
	}

	.money-num2 {
		margin-bottom: 40px;
	}

	.trans-div2 {
		margin-bottom: 10px;
	}

	.swit-row {
		display: flex;
		justify-content: space-between;
		align-items: center;

		p {
			font-size: 24px;
			font-weight: 600;
			color: #000;
		}
	}

	.profit-stop {
		display: flex;
		justify-content: space-between;
		margin-top: 40px;

		p {
			margin-bottom: 20px;
		}

		.profitcss {
			width: 48%;
		}

		.losscss {
			width: 48%;
		}

		.el-input__wrapper {
			border-radius: 16px;
			height: 100px;
			color: #292929;
			font-size: 30px;
			font-weight: 500;
			padding-left: 34px;
		}
	}

	.buy-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 110px;
		background: #f8f9fb;
		padding-left: 34px;
		padding-right: 34px;
		font-size: 24px;
		color: #292d32;

		.numcss {
			color: #292d32;
			font-size: 24px;
			font-weight: 400;
			padding: 0;
			line-height: inherit;
			background: transparent;

			&::after {
				display: none;
			}
		}
	}

	.price-block {
		margin-bottom: 32px;
		margin-top: 28px;
	}

	.buyprice {
		display: flex;
		color: #a9aaab;
		font-size: 24px;
		font-weight: 500;
		margin-bottom: 34px;
	}

	.buy-volume {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-radius: 20px;
		background: #f9fafc;
		height: 110px;
		padding: 0 34px;
		margin-bottom: 20px;

		.van-cell {
			padding: 0;
			line-height: inherit;
			background: transparent;

			&::after {
				display: none;
			}
		}
	}

	.incre-decre {
		display: flex;

		.numbtn {
			height: 90px;
			padding: 28px;
			font-size: 28px;
			color: #000;
			border-radius: 20px;
			background: #fff;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.padcss {
			margin-right: 24px;
		}
	}

	.margin-commission {
		display: flex;
		justify-content: space-between;
		margin-bottom: 40px;

		p {
			color: #a9aaab;
			font-size: 24px;
			font-weight: 500;
		}
	}

	.option-image {
		width: 16px;
		height: 16px;
	}

	.block1 {
		margin-top: 48px;

		.demonstration {
			display: block;
			color: #999;
			font-size: 24px;
			font-style: normal;
			font-weight: 400;
			margin-bottom: 10px;
		}

		.el-slider {
			margin-bottom: 80px;
			padding-left: 10px;
			padding-right: 10px;

			.el-slider__runway {
				background: #84a8f2;

				.el-slider__bar {
					background: #84a8f2;
				}
			}

			.el-slider__button-wrapper {
				width: 30px;
				height: 30px;
				top: -15px;

				.el-slider__button {
					width: 30px;
					height: 30px;
				}
			}

			.el-slider__marks {
				.el-slider__marks-text {
					&:first-child {
						left: 3%;
						margin-left: 3%;
					}

					&:last-child {
						left: 96% !important;
					}
				}
			}
		}
	}

	.money-block {
		width: 140px;
		height: 60px;
		border-radius: 10px;
		background: #f9fafc;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.sign-css {
		width: 16px;
		margin-right: 24px;
	}

	.money-css {
		color: #000;
		font-size: 13px;
		font-weight: 500;
	}

	.back-css {
		width: 40px;
	}

	.coin-css {
		width: 45px;
	}

	.coin-name {
		color: #000;
		font-weight: 600;
		font-size: 14px;
		text-align: left;
		margin-left: 16px;
	}

	.dialog-footer {
		margin: auto;
		text-align: center;
	}

	.buy-btn {
		color: #fff;
		width: 90%;
		height: 110px;
		font-size: 28px;
		border-radius: 60px;
		background: #82a8f9;
		margin-bottom: 120px;
	}
	.down-btn {
		background: #e8503a;
	}

	.el-input__wrapper {
		border-radius: 40px;
		background: #f9fafc;
		box-shadow: none;
		padding: 15px 16px;
	}
}
</style>
<style>
.el-input-number {
	border: none !important;
	/* Remove border from the container */
	box-shadow: none !important;
	/* Remove box-shadow from the container */
	background-color: #f9fafc !important;
	/* Set background color */
}

.el-input-number .el-input__inner {
	border: none !important;
	/* Remove border from the input field */
	box-shadow: none !important;
	/* Remove any box-shadow */
	background-color: #f9fafc !important;
	/* Set background color */
}

.el-input-number .el-input-number__controls {
	border: none !important;
	box-shadow: none !important;
}
</style>
<style scoped lang="scss">
.custom-option {
	display: flex;
	align-items: center;
}

.option-image {
	width: 52px;
	height: 52px;
	margin-right: 8px;
}

.option-text {
	font-weight: 510;
	font-size: 24px;
	color: #292d32;
}

.wallet1-select {
	width: 100%;
}

.wallet-select-popper {
	background: #f8f9fb;
	border-radius: 16px;
}
</style>
<style lang="scss">
.wallet-select {
	width: 35%;

	.el-select__wrapper {
		border: none !important;
		padding: 32px 16px;
		box-shadow: none !important;
		background: #f9fafc;
		border-radius: 20px;
		height: 110px;

		.image2 {
			width: 32px;
			height: 32px;
			margin-left: 20px;
		}
	}

	.el-input__wrapper {
		box-shadow: none;
	}

	.el-input-number__decrease,
	.el-input-number__increase {
		border-radius: 4px;
		background: #c7dbfe !important;
	}
}

.image3 {
	width: 40px;
	height: 40px;
	margin-left: 32px;
}

.van-toast {
	z-index: 3000 !important;
}
</style>
