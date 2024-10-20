<template>
	<div class="market_container">
		<div class="header">{{ t('市场') }}</div>
		<div class="market_list">
			<div class="list_info">
				<div class="item" v-for="(item, index) in coinList" :key="index" @click="popupShow(item)">
					<div class="item_img">
						<img :src="$imgpath + item.mainTokenIconUrl" alt="" />
					</div>
					<div class="coin">
						<div class="name">{{ item.symbol }}</div>
						<div>{{ item.mainTokenName }}</div>
					</div>
					<div class="echarts">
						<EchartsLine :line-id="item.symbol || `line-${index}`" :row-data="item" />
						<!-- <img src="../../assets/images/home/echarts.png" alt="echarts" /> -->
					</div>
					<MarketLatestData :row-data="item" />
				</div>
				<!-- kline -->
				<div class="parent-dialog">
					<el-dialog v-model="centerDialogVisible" width="350" align-center class="popup-css" @closed="klinecClosed">
						<template #header>
							<div class="dialog-title">
								<img @click="centerDialogVisible = false" src="@/assets/images/market/back.svg" class="back-css" alt="" />
								<span class="title-text">{{ marketEachData.symbol }}</span>
								<img src="@/assets/images/market/back.png" class="back-css" style="visibility: hidden" alt="" />
							</div>
						</template>
						<div class="charts-top">
							<div class="coin-info">
								<div class="coin-row">
									<div class="coin-left">
										<img :src="$imgpath + marketEachData.mainTokenIconUrl" class="coin-css" alt="" />
										<div class="coin-name">
											<p class="name">{{ marketEachData.symbol }}</p>
											<p>{{ marketEachData.mainTokenName }}</p>
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
						<div class="c-backdrop">
							<EchartsMarket ref="echartsMarketRef" :kline-data="klineHistoryList" :symbol-info="symbolInfo" />
						</div>
						<template #footer>
							<van-space :size="10" class="item-block">
								<van-button type="primary" round block class="up-btn" @click="popupFromLower('1')">{{ t('上涨') }}</van-button>
								<van-button type="primary" round block class="down-btn" @click="popupFromLower('0')">{{ t('下跌') }}</van-button>
							</van-space>
						</template>
					</el-dialog>
				</div>
				<!-- 期权/合约 购买 -->
				<div class="child-dialog">
					<el-dialog
						ref="childDialogRef"
						v-model="childDialogVisible"
						:show-close="false"
						:close-on-click-modal="true"
						width="350"
						align-center
						class="popup-css"
						:class="{ bg: optionStatus === 'pending' }"
					>
						<div class="line-css" @click.stop @close="childDialogClose">
							<!--							<div class="parentcss">-->
							<!--								<div class="commontab normalcss" :class="{ activecss: selectTab == 'option' }" @click="tabFunc('option')">{{ t('期权') }}</div>-->
							<!--								<div class="commontab normalcss" :class="{ activecss: selectTab == 'contract' }" @click="tabFunc('contract')">{{ t('合约') }}</div>-->
							<!--							</div>-->
							<div class="coin-row">
								<div class="coin-left">
									<img :src="$imgpath + marketEachData.mainTokenIconUrl" class="coin-css" alt="" @click="childDialogVisible = false" />
									<div class="coin-name">
										<p class="name">{{ marketEachData.symbol }}</p>
										<p>{{ marketEachData.mainTokenName }}</p>
									</div>
								</div>
								<div class="coin-right">
									<p class="coin-price">${{ symbolInfo.closePlain || symbolInfo.close }}</p>
									<p class="coin-percent" :class="{ up: symbolInfo.dailyChange > 0 }">
										{{ symbolInfo.dailyChange > 0 ? '+' : '' }}{{ symbolInfo.dailyChange }}%
									</p>
								</div>
							</div>
							<van-divider />
						</div>
						<div v-if="selectTab === 'option'">
							<p class="time-css">{{ t('时间') }}</p>
							<template v-if="optionStatus === 'wait'">
								<div class="scroll-container">
									<div class="measure-block measure-block2">
										<div
											v-for="(prodFina, index) in prodFinalList"
											class="each-measure"
											:key="index"
											:class="selectProductFinalConfig.productId === prodFina.productId ? 'activeTime' : ''"
											@click="prodActiveFunc(prodFina)"
										>
											<p class="upper-txt">{{ prodFina.time }} s</p>
											<p class="lower-txt">Ror:{{ prodFina.oddsRate || 0 }}%</p>
										</div>
									</div>
								</div>
								<div class="trans-div">
									<p class="transaction-css">{{ t('交易费') }}:</p>
									<p class="transaction-amount">$ {{ timesForValueDecimal(marketEachData.feeRate, buyAmount) }}</p>
								</div>
								<div class="money-num">
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
									<div class="step-input">
										<el-input-number v-model="buyAmount" :min="0" class="custom-input-number" @blur="formatterNumVal" >
											<template #increase-icon>
												<img src="../../assets/images/market/increase.png" alt="plus"  />
											</template>
											<template #decrease-icon>
												<img src="../../assets/images/market/decrease.png" alt="minus"  />
											</template>
										</el-input-number>
									</div>
								</div>
								<div class="trans-div trans-div2">
									<p class="transaction-css">{{ t('可用余额') }}:</p>
									<p class="transaction-amount">
										{{ plusDecimal(platformAccountOfOptionsType.balance || 0) }} {{ platformAccountOfOptionsType.tokenName || '' }}
									</p>
								</div>
							</template>
							<template v-if="optionStatus === 'pending'">
								<div class="countdown" v-if="optionOrderData && optionOrderData.period">
									<template v-if="optionOrderProgress !== 100">
										<div class="des">
											<p class="p1"><van-count-down :time="optionOrderData.period * 1000" format="ss" @change="countDownChange" /> s</p>
											<p class="p2">ROI:{{ selectProductFinalConfig.oddsRate * 100 }}%</p>
										</div>
										<div class="progress">
											<van-progress :percentage="optionOrderProgress" :show-pivot="false" track-color="#F4F4F4" color="#ad9467" stroke-width="8px" />
										</div>
									</template>
									<div v-else class="num" :class="{ up: expectedSymbol === '+' }">{{ expectedSymbol }}${{ optionOrderData.profitLossAmount }}</div>
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
										<span class="p2 ellipsis">{{ expectedSymbol }} ${{ optionOrderData.profitLossAmount }}</span>
									</div>
									<div class="item1">
										<span class="p1">{{ t('类型') }}</span>
										<span class="p2 ellipsis">{{ priceChanDir === '1' ? t('上涨') : t('下跌') }}</span>
									</div>
								</div>
							</template>
						</div>

						<div v-else-if="selectTab === 'contract'">
							<div class="block1">
								<span class="demonstration">{{ t('杠杆') }}: {{ leverageVal }}X</span>
								<el-slider v-model="leverageVal" :min="1" :max="marketEachData.leverageTimes" show-stops :marks="marks"> </el-slider>
							</div>
							<div class="money-num money-num2">
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
									<p>{{ marketEachData.symbol }}</p>
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
									<p>{{ t('手续费') }}:{{ timesForValueDecimal(marginAmount, marketEachData.feeRate) }}</p>
								</div>
							</div>
							<div class="swit-row">
								<p>{{ t('设置止盈/止损') }}</p>
								<el-switch
									v-model="takeProfitStopLossSwitch"
									size="large"
									active-color="#13ce66"
									inactive-color="#ff4949"
									@change="onTakeProfitStopLossChange"
								>
								</el-switch>
							</div>
							<div v-if="takeProfitStopLossSwitch" class="profit-stop">
								<div class="profitcss">
									<p>{{ t('止盈价') }}</p>
									<el-input placeholder="" v-model="profitPrice"></el-input>
								</div>
								<div class="losscss">
									<p>{{ t('止损价') }}</p>
									<el-input placeholder="" v-model="stopLossPrice"></el-input>
								</div>
							</div>
						</div>
						<template #footer>
							<div class="dialog-footer">
								<template v-if="selectTab === 'option'">
									<van-button
										v-if="optionStatus === 'wait'"
										type="primary"
										block
										round
										class="buy-btn"
										:class="{ 'down-btn': priceChanDir === '0' }"
										@click="buyOptionFunc()"
									>
										{{ priceChanDir === '1' ? t('买涨') : t('买跌') }}
									</van-button>
									<van-button v-else type="primary" block round class="buy-btn" @click="continueHandle">{{ t('继续') }}</van-button>
								</template>
								<van-button v-else-if="selectTab === 'contract'" type="primary" block round class="buy-btn" @click="addContractFunc()">{{
									t('确认')
								}}</van-button>
							</div>
						</template>
					</el-dialog>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { userStore } from '@/store'
import Socket from '@/utils/socket.js'
import EchartsMarket from './echartsMarket.vue'
import MarketLatestData from './marketLatestData.vue'
import EchartsLine from '@/views/market/echartsLine.vue'
import { showToast } from 'vant'
import { useI18n } from 'vue-i18n'
import useLoading from '@/hooks/useLoading.js'
import { onClickOutside } from '@vueuse/core'
import { dividedForValueDecimal, formatDate, getImageUrl, plusDecimal, timesDecimal, timesForValueDecimal } from '@/utils'
import {
	buyOptionApi,
	fetchKlineListApi,
	fetchOptionsProduceListApi,
	fetchTradingPairDetailApi,
	fetchTradingPairListApi,
	getOptionDetailApi,
} from '@/apis/optionAndContract.js'
import { useToken } from '@/hooks/useToken.js'

// 初始化仓库
const uStore = userStore()
const { t } = useI18n()
const loading = useLoading()

// 变量区
const router = useRouter()
const route = useRoute()

// 选择的期权交易币种
const selectCoinOption = ref('0')
// 选择的合约交易币种
const selectContractCoin = ref('0')
// 期权和合约的交易币种
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
]

// 当前选择的交易对
const marketEachData = ref({})
// 交易对详情弹窗
const centerDialogVisible = ref(false)
// 期权合约购买弹窗
const childDialogVisible = ref(false)
// 交易杠杆
const leverageVal = ref(1)
// 查看交易对详情
const popupShow = (data) => {
	marketEachData.value = data
	leverageVal.value = data.leverageTimes
	centerDialogVisible.value = true
	getSymbolInfoFun()
	getKlineList()
	resetData()
}
const childDialogRef = ref(null)
const handleCloseDialog = () => {
	onClickOutside(childDialogRef, (e) => {
		if (e?.target.className === 'el-overlay') {
			childDialogVisible.value = false
			childDialogClose()
		}
	})
}

// 买涨或跌  1涨 0跌
const priceChanDir = ref(undefined)
// 期权和交易弹窗
const popupFromLower = (val) => {
	priceChanDir.value = val
	getProdFinalList()
	getPlatformAccountList()
	childDialogVisible.value = true
	handleCloseDialog()
	resetData()
}
const childDialogClose = () => {
	clearInterval(getOrderTimer.value)
}

// 合约买入手数
const buyVolAmount = ref(0)
// 买入 手数格式化
const formatterBuyVolAmount = (value) => {
	// val = val.replace(/\d/g, '')
	return `${Math.round(parseFloat(value) / 10) * 10}`
}
// 保证金
const marginAmount = computed(() => {
	return dividedForValueDecimal(timesForValueDecimal(buyVolAmount.value, marketEachData.value.oneAmount), leverageVal.value) || 0
})
const decreIncreFunc = (val) => {
	if (val === 'minus' && buyVolAmount.value > 0) {
		buyVolAmount.value = buyVolAmount.value * 1 - 10
	} else if (val === 'plus') {
		buyVolAmount.value = buyVolAmount.value * 1 + 10
	}
}

const { getPlatformTokenList } = useToken()
// 平台账户列表
const platformAccountList = ref([])
// 期权交易币种的平台账户信息
const platformAccountOfOptionsType = computed(() => {
	const labelToFindO = coinOptions[selectCoinOption.value].label
	return (
		platformAccountList.value.find((obj) => {
			return obj.tokenName && obj.tokenName.toLowerCase() === labelToFindO.toLowerCase()
		}) || {
			balance: 0,
			tokenName: labelToFindO.toLowerCase(),
		}
	)
})
// 期权交易币种的平台账户信息
const platformAccountOfContractType = computed(() => {
	const labelToFindC = coinOptions[selectContractCoin.value].label
	return (
		platformAccountList.value.find((obj) => {
			return obj.tokenName && obj.tokenName.toLowerCase() === labelToFindC.toLowerCase()
		}) || {
			balance: 0,
			tokenName: labelToFindC.toLowerCase(),
		}
	)
})
// 获取平台账户列表
const getPlatformAccountList = async () => {
	try {
		loading.loading()
		platformAccountList.value = await getPlatformTokenList()
		loading.clearLoading()
	} catch (err) {
		console.log(err)
	}
}

// 杠杆
const marks = computed(() => {
	let obj = {}
	if (marketEachData.value && marketEachData.value.leverageTimes) {
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

// wait pending confirm
const optionStatus = ref('wait')
const optionOrderData = ref({
	orderAmount: '',
	transactionFee: '',
	period: '',
	id: '',
})

// 期权购买金额
const buyAmount = ref(0)
// 期权买入金额格式化
const formatterNumVal = (e) => {
	let match = e.target.value.match(/^\d+$/)
	e.target.value = match ? parseInt(match[0], 10) : 0
	buyAmount.value = e.target.value * 1
}
// 购买
const buyOptionFunc = async () => {
	if (buyAmount.value * 1 <= 0) {
		showToast({ message: t('金额输入有误，请输入大于0的金额'), icon: 'info' })
		return
	}
	if (!selectProductFinalConfig.value.productId) {
		return showToast({ message: t('产品期权配置信息异常'), icon: 'info' })
	}
	if (buyAmount.value > platformAccountOfOptionsType.value.balance) {
		showToast({ message: t('操作失败，您的代币余额不足'), icon: 'info' })
		return
	}

	let data = {
		amount: buyAmount.value, // 购买金额
		currency: platformAccountOfOptionsType.value.tokenName, // 交易币种
		symbolId: marketEachData.value.symbolId, // 交易对ID
		exchangeDirection: parseInt(priceChanDir.value), // 买涨：1 买跌0
		productId: selectProductFinalConfig.value.productId, // 产品ID
	}

	try {
		loading.loading()
		const res = await buyOptionApi(data)
		loading.clearLoading()
		const { orderAmount, feeAmount, orderId, orderToken } = res.data || {}
		optionStatus.value = 'pending'
		optionOrderData.value = {
			orderToken: orderToken,
			orderAmount: orderAmount, // 订单金额
			transactionFee: feeAmount, // 手续费
			period: selectProductFinalConfig.value.time,
			profitLossAmount: timesDecimal(orderAmount, selectProductFinalConfig.value.oddsRate, 4), // 初始收益
			orderId: orderId,
		}

		showToast({
			message: t('操作成功'),
			icon: 'info',
			onClose: () => {
				// 刷新余额
				getPlatformAccountList()
				computedExpectedPrice()
			},
		})
	} catch (err) {
		console.log(err)
	}
}

// 倒计时
const optionOrderProgress = ref(0)
const countDownChange = (time) => {
	if (time.total && time.seconds === 0) {
		optionOrderProgress.value = 100
		getOptionOrderDetail(optionOrderData.value.orderId)
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
	clearOrderDetailLoop()

	try {
		if (!id) return
		// loading.loading()
		const res = await getOptionDetailApi(id)
		const orderData = res.data
		// loading.clearLoading()
		// 订单未结束，保持轮询
		if (!orderData.close) {
			getOrderTimer.value = setTimeout(() => {
				getOptionOrderDetail(optionOrderData.value.orderId)
			}, 2000)
		} else {
			optionOrderData.value.profitLossAmount = orderData.profitLossAmount
			optionOrderData.value.openPrice = orderData.openPrice
			optionOrderData.value.closePrice = orderData.closePrice
			optionOrderData.value.orderNo = orderData.orderNo
			computedExpectedPrice()
		}
		optionStatus.value = 'pending'
	} catch (err) {
		console.log(err)
	}
}
const clearOrderDetailLoop = () => {
	getOrderTimer.value && clearTimeout(getOrderTimer.value)
}

const continueHandle = () => {
	optionStatus.value = 'wait'
	childDialogVisible.value = false
	resetData()
}

// 购买合约
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
		baseSymbol: platformAccountOfContractType.value.tokenName,
		encryCoinId: prodFinalList.value[0].encryCoinId,
		tradeOpeningPrice: tradeOpeningPrice.value,
		leverageRatio: leverageVal.value > 0 ? leverageVal.value : 1,
		tradeType: tradeTypeSwitchVal.value === true ? '1' : '0',
		purchaseLots: buyVolAmount.value,
		takeProfitPrice: profitPrice.value,
		stopLossPrice: stopLossPrice.value,
		takeProfitStopLoss: takeProfitStopLossSwitch.value,
		coinSymbol: marketEachData.value.symbol,
	}
	try {
		loading.loading()
		// todo 合约接口
		// await addContractOrder(temp)
		loading.clearLoading()
		showToast({
			message: t('成功'),
			icon: 'info',
			onClose: () => {
				getPlatformAccountList()
			},
		})
	} catch (err) {
		console.log(err)
	}
}

// 期权合约tab选择
const selectTab = ref('option')
const tabFunc = (val) => {
	selectTab.value = val
	resetData()
}

// 是否限价委托
const tradeTypeSwitchVal = ref(false)
// 是否止盈或止损
const takeProfitStopLossSwitch = ref(false)
// 止盈价
const profitPrice = ref('')
// 止损价
const stopLossPrice = ref('')
// 设置止盈止损
// 比如用户买跌，要判断止盈价格需要小于买入价格，止跌价格大于买入价格。
// 比如用户买涨，要判断止盈价格需要大于买入价格，止跌价格小于买入价格。
const onTakeProfitStopLossChange = (val) => {
	if (val) {
		if (priceChanDir.value === '0') {
			profitPrice.value = (symbolInfo.value.close * 1 * 0.9).toFixed(2)
			stopLossPrice.value = (symbolInfo.value.close * 1 * 1.1).toFixed(2)
		} else {
			profitPrice.value = (symbolInfo.value.close * 1 * 1.1).toFixed(2)
			stopLossPrice.value = (symbolInfo.value.close * 1 * 0.9).toFixed(2)
		}
	}
}
// 限价委托的 限价
const tradeOpeningPrice = ref(0)
// 默认限价为收盘价
const tradeTypeChange = () => {
	tradeOpeningPrice.value = symbolInfo.value.closePlain * 1
}

// 代码区
// 交易对列表
const coinList = ref([])
// 获取交易对
const getMarketList = async () => {
	try {
		loading.loading()
		const res = await fetchTradingPairListApi()
		loading.clearLoading()
		coinList.value = res.data
	} catch (err) {
		console.log(err)
	}
}
// 交易对详情 最近行情数据
const symbolInfo = ref({
	close: 0,
	dailyChange: 0,
	high: 0,
	low: 0,
	open: 0,
})
const getSymbolInfoFun = async () => {
	try {
		const symbol = marketEachData.value.symbolId || 'btcusdt'
		loading.loading()
		const res = await fetchTradingPairDetailApi(symbol)
		loading.clearLoading()
		symbolInfo.value = res.data || {}
	} catch (err) {
		console.log(err)
	}
}

// 期权配置列表
const prodFinalList = ref([])
// 获取期权配置列表
const getProdFinalList = async () => {
	try {
		loading.loading()
		const res = await fetchOptionsProduceListApi(marketEachData.value.symbolId)
		loading.clearLoading()

		prodFinalList.value = res.data || []
		if (res.data.length === 0) {
			return showToast({ message: t('产品期权配置信息异常'), icon: 'info' })
		}
		selectProductFinalConfig.value = res.data[0]
		optionOrderData.value.period = res.data[0].time
	} catch (err) {
		console.log(err)
	}
}
// 当前选中期权产品
const selectProductFinalConfig = ref({})
const prodActiveFunc = (val) => {
	selectProductFinalConfig.value = val
}

// 现在的价格比下单价格高：买涨，就是正盈利，买跌就说负盈利。现在的价格比下单价格低：买涨，就是负盈利，买跌就说正盈利。盈利计算公式：+/-(amount*roi）
const expectedSymbol = ref('')
const computedExpectedPrice = () => {
	expectedSymbol.value = ''
	if (optionOrderData.value?.orderNo) {
		expectedSymbol.value = optionOrderData.value.profitLossAmount * 1 >= 0 ? '+' : ''
	} else {
		if (priceChanDir.value === '1') {
			expectedSymbol.value = symbolInfo.value.close * 1 >= symbolInfo.value.open * 1 ? '+' : '-'
		} else {
			expectedSymbol.value = symbolInfo.value.close * 1 >= symbolInfo.value.open * 1 ? '-' : '+'
		}
	}
}

// 重置数据
const resetData = () => {
	buyAmount.value = 0
	buyVolAmount.value = 0
	profitPrice.value = ''
	stopLossPrice.value = ''
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

// 5min 30min 60min 1day 1week
const klineTypeList = [
	{
		key: '5min',
		value: '5M',
	},
	{
		key: '30min',
		value: '30M',
	},
	{
		key: '60min',
		value: '1H',
	},
	{
		key: '1day',
		value: '1D',
	},
	{
		key: '1week',
		value: '1W',
	},
]
const klineType = ref(klineTypeList[0].key)
const checkKlineType = (item) => {
	klineType.value = item.key
	getKlineList()
}

// kline线历史数据
const klineHistoryList = ref([])
const echartsMarketRef = ref(null)
const getKlineList = async () => {
	try {
		const params = {
			pageNum: 1,
			pageSize: 100,
			symbol: marketEachData.value.symbol,
			type: klineType.value,
		}
		loading.loading()
		const res = await fetchKlineListApi(params)
		loading.clearLoading()
		klineHistoryList.value = res.data?.sort((a, b) => a.unixTime - b.unixTime) || []
		await nextTick()
		echartsMarketRef.value && echartsMarketRef.value.updateChart(klineHistoryList.value || [])

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
	const symbol = marketEachData.value.symbol.replace('/', '-') || 'BTC-USD'
	// 5m 30m 1h 1d 1w
	const type = klineType.value
	const url = `/kline/${symbol}/${type}`
	klineListSocket.value = new Socket(url)
	klineListSocket.value.init()
	klineListSocket.value.websocket.onmessage = (e) => {
		if (typeof e.data === 'string') {
			let message = JSON.parse(e.data)

			// console.log('getSocket----', message)

			if (klineHistoryList.value.length > 300) {
				klineHistoryList.value = klineHistoryList.value.slice(100)
			}
			symbolInfo.value = message
			const targetIndex = klineHistoryList.value.findIndex((item) => item.unixTime === message.unixTime)
			// console.log('targetIndex----', targetIndex)
			if (targetIndex !== -1) {
				klineHistoryList.value.splice(targetIndex, 1, message)
				// console.log('ddd', klineHistoryList.value)
			} else {
				klineHistoryList.value.push(message)
			}
			nextTick(() => {
				console.log(
					formatDate(message.unixTime * 1000, 'YYYY-MM-DD HH:mm'),
					message.close,
					klineHistoryList.value[klineHistoryList.value.length - 1].close
				)
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
	clearOrderDetailLoop()
})

// 将组件中的数据进行暴露出去
defineExpose({})
</script>

<style lang="scss" scoped>
.c-backdrop{
	margin: 0 20px 0 20px;
}
.market_container {
	// position: relative;
	height: 100%;
	padding: 42px 12px 0;
	background-image: url("../../assets/images/background/sbg_2.png");
	background-position:  top;
	background-size: 100% 100%;

	.header {
		height: 80px;
		padding-left: 20px;
		font-size: 48px;
		font-weight: 600;
		color: #E9E9E9;
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

					border-radius: 18px;
					border: 1px solid #CAB37D;
					background: linear-gradient(99deg, #90C9C6 14.79%, #2194AA 76.69%);
					box-shadow: 3px 6px 4px 0px rgba(0, 0, 0, 0.25);

					font-size: 25px;
					padding: 25px 18px 25px 18px;
					margin-top: 10px;

					.item_img {
						flex: 0 0 76px;
						width: 76px;
						height: 76px;
						border-radius: 50%;
						margin-right: 30px;
						overflow: hidden;

						img {
							width: 100%;
							height: 100%;
						}
					}

					.coin {
						flex: 0 0 140px;
						color: #8D8D8D;
						font-size: 22px;
						font-weight: 500;
						margin-right: 20px;

						.name {
							font-size: 25px;
							font-weight: 700;
							color: #0C0C0C;
							margin-top: 2px;
						}
					}

					.echarts {
						// mix-blend-mode: hard-light;
						width: 180px;
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
						margin-right: auto;
					}
				}

				.charts-top {
					margin-top: 0px;
					padding: 40px 48px;
				}

				.coin-info {
					padding: 24px 0px 12px 0px;
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
							color: #000;

							.name {
								font-size: 28px;
								font-weight: 600;
								margin-top: 10px;
								color: #00DCFF;
							}
						}
					}

					.coin-right {
						.coin-price {
							font-size: 30px;
							font-weight: 500;
							color: #292929;
							text-align: right;
						}

						.coin-percent {
							color: #04F;
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
					//padding: 0 44px;
					margin-top: 15px;

					.high-txt {
						color: #E9E9E9;
						font-size: 24px;
						font-weight: 500;
					}

					.num-txt {
						color: #292929;
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
					color: #E9E9E9;
					font-size: 40px;
					font-weight: 600;
				}

				.up-btn {
					border-radius: 12px;
					background: linear-gradient(180deg, #E3FF43 0%, #27797F 100%);
					box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.25);
					border: none;
					overflow: hidden;
				}

				.down-btn {
					border-radius: 12px;
					background: linear-gradient(180deg, #FF4346 0%, #7F275C 100%);
					box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.25);
					border: none;
					overflow: hidden;
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
		border-radius: 0 !important;

		background-image: url("../../assets/images/background/sbg_2.png");
		background-position:  top;
		background-size: 140% 110%;
	}

	.el-dialog__header,
	.el-dialog__footer {
		width: 100%;
		padding: 40px 20px 20px;
		box-sizing: border-box;
	}

	.el-dialog__header {
		padding: 40px 50px 20px;
		position: fixed;
		background-color: transparent;
	}
	.el-dialog__body {
		padding-top: 100px;
		margin: 0;
		width: 100%;
	}
	.el-dialog__footer {
		padding: 140px 26px 20px;
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
			color: var(--vt-sub-black);
			font-size: 12px;
			font-weight: 500;
		}

		.num-txt {
			color: var(--vt-header-black);
			font-size: 15px;
			font-weight: 400;
		}
	}

	.measure-block {
		display: flex;
		justify-content: space-around;

		border-radius: 18px;
		background: #134D57;
		box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);

		padding: 18px;
		margin-top: 20px;
		margin-bottom: 10px;

		.measure {
			position: relative;
			flex: 1;
			padding: 10px 20px;
			color: #E9E9E9;
			font-weight: 400;
			font-size: 26px;
			margin-right: 25px;

			&:last-child {
				margin-right: 0;
			}

			//&::after {
			//	content: '';
			//	position: absolute;
			//	right: 0;
			//	top: 50%;
			//	width: 2px;
			//	height: 24px;
			//	margin-top: -12px;
			//	border-left: 1px solid rgba($color: #8e8e93, $alpha: 0.3);
			//}
		}

		.active-measure {
			border-radius: 18px;
			background: #124D57;
			box-shadow: -6px -6px 6px 0px rgba(255, 255, 255, 0.25) inset, 4px 4px 4px 0px rgba(0, 0, 0, 0.25) inset;

			font-weight: 500;
			color: #E9E9E9;
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
		background-image: url("@/assets/images/background/sbg_2.png");
		background-position:  top;
		background-size: 100% 200%;
		//height: 1200px;
		min-height: 800px;
		box-sizing: border-box;
		bottom: 0;
		overflow-y: scroll;
	}

	.bg {
		// background: linear-gradient(176deg, rgb(251, 229, 173) 41%, rgb(242, 242, 242) 82%);
	}

	.el-dialog__body {
		width: auto;
		margin: 0 26px;
	}

	.line-css {
		padding: 20px 0px 0px 0px;
		.van-divider{
			background: linear-gradient(270deg, #CAB37D 0%, #947034 19.32%, #FFD77A 50.45%, #947034 82.28%, #CAB37D 100%);
		}
	}

	.parentcss {
		display: flex;
		margin-bottom: 40px;

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

	.el-dialog__footer {
		margin-bottom: 80px;
		padding-left: 50px;
		padding-right: 50px;
	}

	.coin-row {
		display: flex;
		justify-content: space-between;
		align-items: center;

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
				color: #4EC2D8;

				.name {
					font-size: 28px;
					font-weight: 600;
					color: #E9E9E9;
				}
			}
		}

		.coin-right {
			padding-right: 12px;

			.coin-price {
				color: #292929;
				font-size: 28px;
				font-weight: 500;
			}

			.coin-percent {
				color: #e8503a;
				font-size: 28px;
				font-weight: 400;
			}

			.up {
				color: #04F;
			}
		}
	}

	.time-css {
		color: #00DCFF;
		font-size: 28px;
		font-weight: 600;
		margin-top: 0px;
		margin-bottom: 26px;
	}

	.countdown {
		border-radius: 20px;

		border: 1px solid #CAB37D;
		background: linear-gradient(99deg, #90C9C6 14.79%, #2194AA 76.69%);
		box-shadow: 0px 1px 17px 0px rgba(1, 3, 246, 0.12);
		
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 36px 36px 30px 46px;
		margin-bottom: 24px;

		.des {
			flex: 1;
			margin-right: 64px;

			.p1 {
				color: #FFF;
				font-size: 30px;
				font-weight: 500;
				margin-bottom: 6px;
				display: flex;
				align-items: center;

				.van-count-down {
					color: #FFF;
					font-weight: 500;
					margin-right: 3px;
				}
			}

			.p2 {
				color: #8D8D8D;
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
			color: #04F;
		}
	}

	.statics-block {
		border-radius: 24px;

		border: 1px solid #CAB37D;
			background: linear-gradient(99deg, #90C9C6 14.79%, #2194AA 76.69%);
			box-shadow: 0px 1px 17px 0px rgba(1, 3, 246, 0.12);

		padding: 40px;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 32px 34px;

		.item1 {
			display: flex;
			flex-direction: column;
			align-items: center;

			.p1 {
				color: #E9E9E9;
				font-size: 24px;
				margin-bottom: 6px;
				font-weight: 500;
			}

			.p2 {
				color: #8D8D8D;
				font-size: 28px;
				font-weight: 600;
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
			border-radius: 30px;
			border: 1px solid  #CAB37D;
			background: linear-gradient(99deg, rgba(144, 201, 198, 0.50) 14.79%, rgba(33, 148, 170, 0.50) 76.69%);
			box-shadow: 0px 1px 17px 0px rgba(1, 3, 246, 0.12);

			text-align: center;
			padding: 12px 8px 20px;
			flex: 0 0 140px;
			margin-right: 40px;
			width: 140px;
			height: 140px;

			.upper-txt {
				color: rgba(255, 255, 255, 0.50);
				font-size: 28px;
				font-weight: 600;
			}

			.lower-txt {
				color: #222;
				font-size: 24px;
				font-weight: 400;
				margin-top: 4px;
			}
		}

		.activeTime {
			background: linear-gradient(99deg, #DEFFFD 14.79%, #2194AA 76.69%);
			.upper-txt {
				color: #fff;
			}

			.lower-txt {
				color: #555;
			}
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
			color: #00DCFF;
			font-size: 24px;
			font-weight: 400;
		}

		.transaction-amount {
			color: #04F;
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
				background: transparent;

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
				background: transparent;

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
					border-radius: 28px;
					border: 1px solid #FFF;
					background: linear-gradient(180deg, #5CE7FF 0%, #27727F 77.5%, #50CDCD 100%);
					box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
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

	//.dialog-footer {
	//	margin: auto;
	//	text-align: center;
	//}
	//
	.buy-btn {
		color: #fff;
		font-weight: 500;
		width: 100%;
		height: 110px;
		font-size: 28px;

		border-radius: 22px;
		border: 1px solid #FFF;
		background: linear-gradient(180deg, #5CE7FF 0%, #27727F 77.5%, #50CDCD 100%);
		box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.25);
		margin-bottom: 100px;
	}
	.down-btn {
		background: linear-gradient(180deg, #5CE7FF 0%, #27727F 77.5%, #50CDCD 100%);
		box-shadow: 0px -2px 0px 0px rgba(0, 0, 0, 0.10) inset, 0px 2px 4px 0px rgba(0, 0, 0, 0.25);
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
	background-color: transparent !important;
	/* Set background color */
}

.el-input-number .el-input__inner {
	border: none !important;
	/* Remove border from the input field */
	box-shadow: none !important;
	/* Remove any box-shadow */
	background-color: transparent !important;
	/* Set background color */
	color:#292929;
	font-weight: 500;
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
		padding: 32px 16px;

		background: #134D57;
		box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);


		border-radius: 20px;
		height: 110px;
		.el-select__placeholder{
			color:#fff;
			font-weight: 500;
		}
		.el-select__suffix{
			background: #124D57;
			box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.30), -2px -2px 8px rgba(198, 166, 166, 0.25);
			padding: 7px;
			border-radius: 100%;
			.el-select__caret{
				color:#fff;
			}
		}
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
