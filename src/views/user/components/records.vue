<template>
	<div class="records_container custom-page">
		<div>
			<van-nav-bar :fixed="true" :title="t('记录')" @click-left="onClickLeft">
				<template #left>
					<van-icon :name="arrow" size="23" />
				</template>
			</van-nav-bar>
		</div>
		<div class="tabs-wrapper">
			<van-tabs v-model:active="activeName" @click-tab="onClickTab">
				<template v-for="item in tabList" :key="item.value">
					<van-tab :title="item.label" :name="item.value"> </van-tab>
				</template>
			</van-tabs>
		</div>
		<div>
			<div class="main-container">
				<van-pull-refresh v-model="refreshing" @refresh="onRefresh" :loosing-text="t('释放即可刷新')">
					<van-list
						v-model:loading="listLoading"
						v-model:error="listError"
						:error-text="t('请求失败，点击重新加载')"
						:finished="finished"
						:finished-text="isEmptyList ? '' : t('没有更多了')"
						@load="onLoad"
					>
						<template #loading>
							<van-loading class="custom-page-loading" type="spinner" />
						</template>
						<div v-if="['deposit', 'withdraw', 'exchange'].indexOf(activeName) !== -1">
							<!-- =======================账户======================= -->
							<div v-if="!listError && !accountList.length" class="container">
								<div class="notice">
									<img src="../../../assets/images/user/notice.png" alt="notice" />
								</div>
								<div class="title">{{ t('哎呀！') }}</div>
								<div class="info">
									{{ t('您还没有任何交易。') }}
								</div>
								<div class="info">{{ t('列表为空') }}</div>
							</div>
							<div v-else class="each-block" v-for="(list, ind1) in accountList" :key="ind1">
								<div class="each-container">
									<!-- 充值 -->
									<div class="title1-row" v-if="orderTypeArr[activeName]">
										<img :src="orderTypeArr[activeName].img" class="img-css" alt="notice" />
										<span>
											<p class="day-text">{{ orderTypeArr[activeName].label }}</p>
										</span>
									</div>
									<div class="title1-row" v-else>
										<img :src="orderTypeArr.default.img" class="img-css" alt="notice" />
										<span>
											<p class="day-text">{{ orderTypeArr.default.label }}</p>
										</span>
									</div>

									<template v-if="activeName === 'deposit'">
										<div class="content-row">
											<p class="left-text">{{ t('发币') }}:</p>
											<p class="right-text">{{ toFixedDecimal(list.rechargeAmount, 8) }} {{ list.rechargeToken }}</p>
										</div>
										<div class="content-row">
											<p class="left-text">{{ t('收币') }}:</p>
											<p class="right-text">{{ toFixedDecimal(list.rechargeAmount, 8) }} {{ list.rechargeToken }}</p>
										</div>
										<div class="content-row">
											<p class="left-text">{{ t('时间') }}:</p>
											<p class="right-text">{{ formatDate(list.createTime) }}</p>
										</div>
									</template>

									<template v-if="activeName === 'withdraw'">
										<div class="content-row">
											<p class="left-text">{{ t('发币') }}:</p>
											<p class="right-text">{{ toFixedDecimal(list.withdrawAmount, 8) }} {{ list.withdrawToken }}</p>
										</div>
										<div class="content-row">
											<p class="left-text">{{ t('收币') }}:</p>
											<p class="right-text">{{ toFixedDecimal(list.withdrawAmount, 8) }} {{ list.withdrawToken }}</p>
										</div>
										<div class="content-row">
											<p class="left-text">{{ t('时间') }}:</p>
											<p class="right-text">{{ formatDate(list.ceateTime) }}</p>
										</div>
									</template>

									<template v-if="activeName === 'exchange'">
										<div class="content-row">
											<p class="left-text">{{ t('发币') }}:</p>
											<p class="right-text">{{ toFixedDecimal(list.fromAmount, 8) }} {{ list.fromToken }}</p>
										</div>
										<div class="content-row">
											<p class="left-text">{{ t('收币') }}:</p>
											<p class="right-text">{{ toFixedDecimal(list.toAmount, 8) }} {{ list.toToken }}</p>
										</div>
										<div class="content-row">
											<p class="left-text">{{ t('时间') }}:</p>
											<p class="right-text">{{ formatDate(list.createTime) }}</p>
										</div>
									</template>

									<div class="content-row" v-if="['deposit', 'withdraw'].indexOf(activeName) !== -1">
										<p class="left-text">{{ t('状态') }}:</p>
										<p class="right-text">
											<Status v-if="list.orderStatus === 0" status="process" />
											<Status v-else-if="list.orderStatus === 1" status="success" />
											<Status v-else-if="list.orderStatus === 2" status="fail" />
										</p>
									</div>
								</div>
							</div>
						</div>
						<div v-else-if="activeName === 'interest'">
							<!-- ================= 理财 计息 ==================== -->
							<div v-if="!listError && !financialClientList.length" class="container">
								<div class="notice">
									<img src="@/assets/images/user/notice.png" alt="notice" />
								</div>
								<div class="title">{{ t('哎呀！') }}</div>
								<div class="info">
									{{ t('您还没有任何交易。') }}
								</div>
								<div class="info">{{ t('列表为空') }}</div>
							</div>
							<div v-else class="each-block" v-for="(list, ind1) in financialClientList" :key="list.stakeOrderId">
								<div class="each-container">
									<div class="title-row title-row1">
										<p class="day-text">{{ list.stakeDay }}{{ $t('天') }}</p>

										<div class="right">
											<img src="@/assets/images/user/verified_user.svg" class="img-css" alt="notice" />
										</div>
									</div>
									<div class="content-row">
										<p class="left-text">{{ t('金额') }}:</p>
										<p class="right-text">{{ toFixedDecimal(list.stakeAmount || 0, 8) }} {{ list.stakeToken }}</p>
									</div>
									<div class="content-row">
										<p class="left-text">{{ t('期限') }}:</p>
										<p class="right-text">{{ list.stakeDay }}{{ $t('天') }}</p>
									</div>
									<div class="content-row">
										<p class="left-text">{{ t('总收入') }}:</p>
										<p class="right-text">{{ toFixedDecimal(list.awardAmout || 0, 8) }} {{ list.awardToken }}</p>
									</div>
									<div class="content-row">
										<p class="left-text">{{ t('订单编号') }}:</p>
										<p class="right-text">{{ list.stakeOrderId }}</p>
									</div>
									<div class="content-row">
										<p class="left-text">{{ t('创建时间') }}:</p>
										<p class="right-text">{{ formatDate(list.orderStartTime) }}</p>
									</div>
									<div class="content-row">
										<p class="left-text">{{ t('到期日期') }}:</p>
										<p class="right-text">{{ formatDate(list.orderEndTime) }}</p>
									</div>
									<!--  未结束、质押中的质押单状态-->
									<div class="content-row" v-if="list.orderStatus !== 2">
										<p class="left-text">
											<span v-if="[1, 4].indexOf(list.orderStatus) !== -1">{{ t('状态') }}:</span>
											<span v-if="[5, 3, 6].indexOf(list.orderStatus) !== -1">{{ t('赎回状态') }}:</span>
											<span v-if="[7, 8, 9].indexOf(list.orderStatus) !== -1">{{ t('领取状态') }}:</span>
										</p>
										<p class="right-text">
											<Status :status="getStakeOrderStatus(list.orderStatus)" />
										</p>
									</div>
								</div>
								<div class="btn-list">
									<!-- 质押审核通过、赎回失败可申请赎回-->
									<!-- 申请赎回时禁用按钮-->
									<!--									<van-button-->
									<!--										v-if="[1, 5, 6].indexOf(list.orderStatus) !== -1"-->
									<!--										block-->
									<!--										round-->
									<!--										type="primary"-->
									<!--										:disabled="list.orderStatus === 5"-->
									<!--										@click="showInterestPopupFunc(list)"-->
									<!--										class="btn-css"-->
									<!--									>-->
									<!--										<p class="">{{ t('赎回') }}</p>-->
									<!--									</van-button>-->

									<!-- 质押订单结束、领取失败可申请领取奖励-->
									<!-- 申请领取奖励时禁用按钮-->
									<van-button v-if="list.orderStatus === 2" block round type="primary" @click="onClaimRewards(list)" class="btn-css">
										<p class="">{{ t('领取奖励') }}</p>
									</van-button>
								</div>
							</div>
						</div>
						<div v-else-if="activeName === 'stake'">
							<!-- ================= 质押 ==================== -->
							<div v-if="!listError && !pledgeClientList.length" class="container">
								<div class="notice">
									<img src="@/assets/images/user/notice.png" alt="notice" />
								</div>
								<div class="title">{{ t('哎呀！') }}</div>
								<div class="info">
									{{ t('您还没有任何交易。') }}
								</div>
								<div class="info">
									{{ t('列表为空') }}
								</div>
							</div>
							<div v-else class="each-block" v-for="(list, ind1) in pledgeClientList" :key="ind1">
								<div class="each-container">
									<div class="title-row title-row1">
										<span class="day-text">{{ PledgeTypeArr[list.stakeType].label }}</span>

										<div class="right">
											<img src="@/assets/images/record/shield-01.png" class="img-css success-img" :width="18" :height="22" alt="notice" />
										</div>
									</div>
									<div class="content-row">
										<p class="left-text">{{ t('金额') }}:</p>
										<p class="right-text">{{ toFixedDecimal(list.stakeAmount || 0, 8) }} {{ list.stakeToken }}</p>
									</div>
									<div class="content-row">
										<p class="left-text">{{ t('总收入') }}:</p>
										<p class="right-text">{{ toFixedDecimal(list.awardAmout || 0, 8) }} {{ list.awardToken }}</p>
									</div>
									<div class="content-row">
										<p class="left-text">{{ t('质押时间') }}:</p>
										<p class="right-text">{{ formatDate(list.orderStartTime) }}</p>
									</div>
									<div class="content-row">
										<p class="left-text">{{ t('释放时间') }}:</p>
										<p class="right-text">{{ formatDate(list.orderEndTime) }}</p>
									</div>
									<!--  未结束、质押中的质押单状态-->
									<div class="content-row" v-if="list.orderStatus !== 2">
										<p class="left-text">
											<span v-if="[1, 4].indexOf(list.orderStatus) !== -1">{{ t('状态') }}:</span>
											<span v-if="[5, 3, 6].indexOf(list.orderStatus) !== -1">{{ t('赎回状态') }}:</span>
											<span v-if="[7, 8, 9].indexOf(list.orderStatus) !== -1">{{ t('领取状态') }}:</span>
										</p>
										<p class="right-text">
											<Status :status="getStakeOrderStatus(list.orderStatus)" />
										</p>
									</div>
								</div>
								<div class="btn-list">
									<!-- 质押审核通过、赎回失败可申请赎回-->
									<!-- 申请赎回时禁用按钮-->
									<!--									<van-button-->
									<!--										v-if="[1, 5, 6].indexOf(list.orderStatus) !== -1"-->
									<!--										:disabled="list.orderStatus === 5"-->
									<!--										type="primary"-->
									<!--										block-->
									<!--										round-->
									<!--										@click="showInterestPopupFunc(list)"-->
									<!--										class="btn-css"-->
									<!--									>-->
									<!--										<p class="">{{ t('赎回') }}</p>-->
									<!--									</van-button>-->

									<!-- 质押订单结束、领取失败可申请领取奖励-->

									<!-- 申请领取奖励时禁用按钮-->
									<van-button v-if="list.orderStatus === 2" type="primary" block round @click="onClaimRewards(list)" class="btn-css">
										<p class="">{{ t('领取奖励') }}</p>
									</van-button>
								</div>
							</div>
						</div>

						<div v-else-if="activeName === 'option'">
							<!-- ================= 期权 ==================== -->
							<div v-if="!listError && !optionList.length" class="container">
								<div class="notice">
									<img src="@/assets/images/user/notice.png" alt="notice" />
								</div>
								<div class="title">{{ t('哎呀！') }}</div>
								<div class="info">
									{{ t('您还没有任何交易。') }}
								</div>
								<div class="info">{{ t('列表为空') }}</div>
							</div>
							<div v-else class="each-block" v-for="(list, ind1) in optionList" :key="ind1">
								<div class="each-container">
									<div class="title-row title-row1">
										<p class="day-text">{{ list.symbol.toUpperCase() }}</p>

										<div class="right">
											<img v-if="list.exchangeDirection === 1" src="@/assets/images/user/verified_user.svg" class="img-css success-img" alt="notice" />
											<img v-if="list.exchangeDirection === 0" src="@/assets/images/record/shield-02.png" class="img-css" alt="notice" />
										</div>
									</div>
									<div class="content-row">
										<p class="left-text">{{ t('类型') }}:</p>
										<p class="right-text uptext" v-if="list.exchangeDirection === 1">{{ t('上涨') }}</p>
										<p class="right-text downtext" v-if="list.exchangeDirection === 0">{{ t('下跌') }}</p>
									</div>
									<div class="content-row">
										<p class="left-text">{{ t('金额') }}:</p>
										<p class="right-text">{{ toFixedDecimal(list.orderAmount || 0, 8) }}{{ list.orderToken }}</p>
									</div>
									<div class="content-row">
										<p class="left-text">{{ t('开盘价格') }}:</p>
										<p class="right-text">{{ list.openPrice }}</p>
									</div>
									<div class="content-row">
										<p class="left-text">{{ t('收盘价格') }}:</p>
										<p class="right-text">{{ list.closePrice }}</p>
									</div>
									<div class="content-row">
										<p class="left-text">{{ t('时间') }}:</p>
										<p class="right-text">{{ list.period || 0 }}s</p>
									</div>
									<div class="content-row">
										<p class="left-text">{{ t('费用') }}:</p>
										<p class="right-text">${{ list.feeAmount }}</p>
									</div>
									<div class="content-row">
										<p class="left-text">{{ t('预期') }}:</p>
										<p class="right-text">{{ list.profitLossAmount }}{{ list.orderToken }}</p>
									</div>
									<div class="content-row">
										<p class="left-text">{{ t('创建时间2') }}:</p>
										<p class="right-text">{{ formatDate(list.createTime) }}</p>
									</div>
								</div>
							</div>
						</div>

						<div v-else-if="activeName === 'contract'">
							<!-- ================= 合约 ==================== -->
							<div v-if="!listError && !contractList.length" class="container">
								<div class="notice">
									<img src="@/assets/images/user/notice.png" alt="notice" />
								</div>
								<div class="title">{{ t('哎呀！') }}</div>
								<div class="info">
									{{ t('您还没有任何交易。') }}
								</div>
								<div class="info">{{ t('列表为空') }}</div>
							</div>
							<div v-else class="each-block" v-for="(list, ind1) in contractList" :key="ind1">
								<div class="each-container">
									<div class="title-row title-row1">
										<p class="day-text">{{ list.productName }}</p>
									</div>
									<div class="content-row">
										<p class="left-text">{{ t('类型') }}:</p>
										<p class="right-text uptext" v-if="list.tradeType == 1">{{ t('上涨') }}</p>
										<p class="right-text downtext" v-if="list.tradeType == 0">{{ t('下跌') }}</p>
									</div>
									<div class="content-row">
										<p class="left-text">{{ t('保证金') }}:</p>
										<p class="right-text">{{ toFixedDecimal(list.margin, 2) }}</p>
									</div>
									<div class="content-row">
										<p class="left-text">{{ t('杠杆') }}:</p>
										<p class="right-text">{{ list.leverageRatio }}X</p>
									</div>
									<div class="content-row">
										<p class="left-text">{{ t('手数') }}:</p>
										<p class="right-text">{{ list.purchaseLots }}</p>
									</div>
									<div class="content-row">
										<p class="left-text">{{ t('开盘价格') }}:</p>
										<p class="right-text">{{ list.tradeOpeningPrice }}</p>
									</div>
									<div class="content-row">
										<p class="left-text">{{ t('收盘价格') }}:</p>
										<p class="right-text">{{ list.tradeClosingPrice }}</p>
									</div>
									<div class="content-row">
										<p class="left-text">{{ t('点') }}:</p>
										<!-- <p class="right-text">{{list}}</p> -->
										<p class="right-text">{{ list.currentPrice }}</p>
									</div>
									<div class="content-row">
										<p class="left-text">{{ t('交易费用') }}:</p>
										<p class="right-text">{{ list.transactionFee }}</p>
									</div>
									<div class="content-row">
										<p class="left-text">{{ t('利润') }}:</p>
										<p class="right-text">{{ list.profitLossAmount }}</p>
									</div>
									<div class="content-row">
										<p class="left-text">{{ t('开盘时间') }}:</p>
										<p class="right-text">{{ list.tradeOpeningTime }}</p>
									</div>
									<div class="content-row">
										<p class="left-text">{{ t('收盘时间') }}:</p>
										<p class="right-text">{{ list.tradeClosingTime }}</p>
									</div>
								</div>
								<div v-if="list.orderStatus !== '2'" class="btn-list">
									<van-button type="primary" block round @click="manualClosePosition(list)" class="btn-css">
										<p class="">{{ t('平仓') }}</p>
									</van-button>
								</div>
							</div>
						</div>
					</van-list>
				</van-pull-refresh>
			</div>
			<!-- 质押赎回确认 -->
			<div>
				<el-dialog v-model="interestDialogVisible" width="350" align-center class="popup-css">
					<template #header>
						<div class="dialog-title">
							<span class="title-text">⚠ {{ t('警告') }}</span>
						</div>
					</template>
					<span class="text">
						{{
							t('如果提前终止交易，您将无法获得完整的收益 {金额}。', {
								amount: eachData.stakeAmount,
								symbol: eachData.stakeToken,
							})
						}}
					</span>
					<template #footer>
						<div class="dialog-footer">
							<van-button block round plain type="primary" class="confirm-btn" @click="onPledgeRedemption()">{{ t('确认') }}</van-button>
							<van-button block round type="primary" class="cancel-btn" @click="interestDialogVisible = false">{{ t('取消') }}</van-button>
						</div>
					</template>
				</el-dialog>
			</div>
		</div>
	</div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import arrow from '@/assets/images/market/back.svg'
import { userStore } from '@/store'
import { useI18n } from 'vue-i18n'
import useLoading from '@/hooks/useLoading.js'
import { formatDate, toFixedDecimal } from '@/utils/index.js'
import { dayjs } from 'element-plus'
import usePage from '@/hooks/usePage.js'
import { fetchOptionsListApi } from '@/apis/optionAndContract.js'
import { claimRewardsApi, fetchStakeOrderListApi, pledgeRedemptionApi } from '@/apis/stake.js'
import Status from '@/components/Status/index.vue'
import { showToast } from 'vant'
import { fetchExchangeOrderListApi, fetchRechargeOrderListApi, fetchWithdrawOrderListApi } from '@/apis/user.js'

defineOptions({
	name: 'Records',
})
// 初始化仓库
const store = userStore()
const { t } = useI18n()
// 变量区
const router = useRouter()
const route = useRoute()
const loading = useLoading()

const eachData = ref({})
const intervalId = ref(null)
const interestDialogVisible = ref(false)

const accountList = ref([])
const financialClientList = ref([])
const pledgeClientList = ref([])
const optionList = ref([])
const contractList = ref([])

// tab选中参数
const activeName = ref('deposit')
// tab数据
const tabList = ref([
	{
		label: t('充值'),
		value: 'deposit',
	},
	{
		label: t('提现'),
		value: 'withdraw',
	},
	{
		label: t('兑换'),
		value: 'exchange',
	},
	{
		label: t('计息'),
		value: 'interest',
	},
	{
		label: t('POS质押'),
		value: 'stake',
	},
	{
		label: t('期权2'),
		value: 'option',
	},
	// {
	// 	label: t('合约'),
	// 	value: 'contract',
	// },
])
const PledgeTypeArr = ref({
	0: {
		label: t('个人质押'),
		value: '0',
	},
	1: {
		label: t('智能合约'),
		value: '1',
	},
	2: {
		label: t('理财质押'),
		value: '2',
	},
	3: {
		label: t('联合质押'),
		value: '3',
	},
})

const orderTypeArr = ref({
	deposit: {
		label: t('充值'),
		value: '1',
		img: new URL(`@/assets/images/record/card-add.png`, import.meta.url).href,
	},
	withdraw: {
		label: t('提现'),
		value: '2',
		img: new URL(`@/assets/images/record/card-minus.png`, import.meta.url).href,
	},
	exchange: {
		label: t('兑换'),
		value: '20',
		img: new URL(`@/assets/images/user/exchange.png`, import.meta.url).href,
	},
	'24': {
		label: t('快捷支付'),
		value: '24',
		img: new URL(`@/assets/images/user/send.png`, import.meta.url).href,
	},
	'21': {
		label: t('静态收益'),
		value: '21',
		img: new URL(`@/assets/images/record/card-minus.png`, import.meta.url).href,
	},
	default: {
		img: new URL(`@/assets/images/record/card-minus.png`, import.meta.url).href,
	},
})

// 代码区
const onClickLeft = () => {
	history.back()
	store.SET_PATH_DATA('yes')
}
const onClickTab = ({ name }) => {
	activeName.value = name
	pageData.pageNum = 0
	onRefresh()
}

const getRecordApi = (data) => {
	let fetchApi,
		commonData = {}
	if (activeName.value === 'deposit') {
		fetchApi = fetchRechargeOrderListApi
	} else if (activeName.value === 'withdraw') {
		fetchApi = fetchWithdrawOrderListApi
	} else if (activeName.value === 'exchange') {
		fetchApi = fetchExchangeOrderListApi
	} else if (activeName.value === 'interest') {
		fetchApi = fetchStakeOrderListApi
		// 0:个人质押,1:用户定制产品,2:理财产品,3:联合质押
		commonData = {
			stakeTypes: [2],
		}
	} else if (activeName.value === 'stake') {
		fetchApi = fetchStakeOrderListApi
		// 0:个人质押,1:用户定制产品,2:理财产品,3:联合质押
		commonData = {
			stakeTypes: [0, 3],
		}
	} else if (activeName.value === 'option') {
		fetchApi = fetchOptionsListApi
	}
	// else if (activeName.value === 'contract') {
	// 	fetchApi = getContractOrderList
	// }
	return fetchApi({
		pageNum: data.pageNum,
		pageSize: data.pageSize,
		...commonData,
	})
}
const { onRefresh, onLoad, listLoading, listError, finished, isEmptyList, refreshing, dataList, pageData } = usePage(getRecordApi)
watch(
	() => dataList.value,
	(val) => {
		let currentList
		if (['deposit', 'withdraw', 'exchange'].indexOf(activeName.value) !== -1) {
			currentList = accountList
		} else if (activeName.value === 'interest') {
			currentList = financialClientList
		} else if (activeName.value === 'stake') {
			currentList = pledgeClientList
		} else if (activeName.value === 'option') {
			currentList = optionList
		} else if (activeName.value === 'contract') {
			currentList = contractList
		}
		currentList.value = val
	}
)

// 理财订单  是否可以提前赎回
const isEarlyRedemption = (data) => {
	// earlyRedemptionTime() 无值 并且 定单到期时间expireDate比现在晚
	return !data.earlyRedemptionTime && dayjs(data.expireDate).isAfter(Date.now())
}

// Function to stop polling
const stopPolling = () => {
	if (intervalId.value) {
		clearInterval(intervalId.value)
		intervalId.value = null // Reset the interval ID
	}
}

// ========= 质押赎回 begin ============
const getStakeOrderStatus = (status) => {
	let statusText
	// 0-新建订单 1-质押审核通过  4-质押审核不通过 2-质押结束
	// 5-申请赎回 3-赎回申请成功 6-赎回申请失败
	// 7-申请领取奖励 8-领取成功 9-领取失败
	switch (status) {
		case 0:
		case 5:
		case 7:
			statusText = 'process'
			break
		case 1:
		case 3:
		case 8:
			statusText = 'success'
			break
		case 4:
		case 6:
		case 9:
			statusText = 'fail'
			break
	}
	return statusText
}
// 理财赎回罚款
const interestEmissionRate = ref(0)
// update dialog interest
const showInterestPopupFunc = async (list) => {
	eachData.value = list
	interestDialogVisible.value = true
}

// 质押赎回
const onPledgeRedemption = async () => {
	try {
		loading.loading()
		await pledgeRedemptionApi({
			orderId: eachData.value.stakeOrderId,
		})
		loading.clearLoading()
		interestDialogVisible.value = false

		showToast({
			icon: 'info',
			message: t('操作成功'),
			onClose: () => {
				onClickTab({ name: activeName.value })
			},
		})
	} catch (error) {
		console.log(error)
	}
}
// ========= 质押赎回 end ============

// 领取奖励
const onClaimRewards = async (stakeOrder) => {
	try {
		loading.loading()
		await claimRewardsApi({
			orderId: stakeOrder.stakeOrderId,
		})
		loading.clearLoading()

		showToast({
			icon: 'info',
			message: t('操作成功'),
			onClose: () => {
				onClickTab({ name: activeName.value })
			},
		})
	} catch (e) {
		console.log(e)
	}
}

// 平仓
const manualClosePosition = async (item) => {
	try {
		const params = {
			id: item.id,
		}
		loading.loading()
		// await manualClosePositionApi(params)
		loading.clearLoading()

		showToast({
			icon: 'info',
			message: t('操作成功'),
			onClose: () => {
				onClickTab({ name: activeName.value })
			},
		})
	} catch (error) {
		console.log(error)
	}
}

onMounted(() => {
	store.SET_PATH_DATA('no')

	let currentTab = activeName.value
	if (route.query?.tab) {
		currentTab = route.query.tab
	}
	onClickTab({ name: currentTab })
})

onUnmounted(() => {
	stopPolling()
})

// 将组件中的数据进行暴露出去
defineExpose({})
</script>

<style scoped>
.popup-css {
	width: 90%;
	border-radius: 8px;
}

.tabs-wrapper {
	margin-top: 40px;
	/* Enable horizontal scrolling */
	white-space: nowrap;
	/* Prevent line breaks */

	overflow-x: scroll;
	/* Allow horizontal scrolling */
	overflow-y: hidden;
	/* Ensure no vertical scrolling */
	width: 100%;
	/* Full width */
	scroll-behavior: smooth;
	/* Optional: smooth scrolling effect */
}

.tabs-wrapper::-webkit-scrollbar {
	display: none;
}

/* Hide scrollbar for WebKit browsers (Chrome, Safari) */
.tabs-wrapper::-webkit-scrollbar {
	display: none;
	/* Hides the scrollbar */
}

/* Hide scrollbar for Firefox */
.tabs-wrapper {
	scrollbar-width: none;
	/* Hides the scrollbar */
}

/* Hide scrollbar for IE and Edge */
.tabs-wrapper {
	-ms-overflow-style: none;
	/* Hides the scrollbar */
}
</style>
<style lang="scss" scoped>
.records_container {
	position: relative;
	padding-bottom: 20px;
	background-image: url("@/assets/images/background/sbg_2.png");
	background-position:  top;
	background-size: 250% 250%;
	min-height: 100vh;

	.container {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		// margin-top: 50%;
		padding-top: 50%;

		.notice {
			width: 106px;
			height: 106px;

			img {
				width: 100%;
				height: 100%;
			}
		}

		.title {
			font-size: 42px;
			color: #000;
			font-weight: 700;
			margin: 30px 0px;
		}

		.info {
			font-size: 25px;
			color: #a4a4a4;
		}
	}

	.main-container {
		margin: 32px 0;
		padding: 0 34px;
		
		.van-list{
			padding: 3px;
		}

		.each-block {
			border-radius: 14px;
			border-top: 1.5px solid #FFF;
			background: linear-gradient(270deg, rgba(153, 153, 153, 0.30) 0%, rgba(255, 255, 255, 0.30) 100%);
			box-shadow: 0px 2px 4.4px 2px rgba(0, 0, 0, 0.15);
			position: relative;
			
			padding: 34px;
			margin-bottom: 32px;
			border-radius: 32px;

			&::before {
					content: '';
					position: absolute;
					top: 47px;
					margin-top: -16px;
					left: 0;
					width: 13px;
					height: 52px;
					background:  linear-gradient(180deg, rgba(216, 228, 252, 0.80) 0%, rgba(21, 177, 220, 0.80) 78%, rgba(60, 150, 223, 0.80) 100%);
					border-radius: 0.3rem;
				}

			.each-container {
				position: relative;
			}

			.title-row,
			.title1-row,
			.content-row {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 20px;

				.day-text {
					color: var(--vt-header-black);
					font-size: 28px;
					font-weight: 600;
				}

				.img-css {
					width: 48px;
					height: 48px;
					margin-right: 20px;

					&.success-img {
						width: 36px;
						height: 44px;
					}
				}
				.right {
					.img-css {
						margin-right: 0;
					}
				}

				.left-text {
					font-size: 24px;
					font-weight: 500;
					color: var(--vt-sub-black);
				}

				.right-text {
					font-size: 24px;
					font-weight: 600;
					color: var(--vt-header-black);
				}

				.uptext {
					color: #1eb500;
				}

				.downtext {
					color: red;
				}
			}

			.title1-row {
				justify-content: unset;
				position: relative;
				margin-bottom: 30px;
				// &::before {
				// 	content: '';
				// 	position: absolute;
				// 	top: 50%;
				// 	margin-top: -16px;
				// 	left: 0;
				// 	width: 8px;
				// 	height: 32px;
				// 	background-color: #7ba9ff;
				// 	border-radius: 0.3rem;
				// }
			}

			.title-row {
				position: relative;
				padding-left: 20px;
			}

			.content-row {
				margin-bottom: 40px;
				line-height: 28px;
				&:last-child {
					margin-bottom: 0;
				}
			}
		}

		.notice {
			width: 0.56rem;
			height: 0.56rem;
			margin: auto;
			background: #82a9f9;
			display: flex;
			align-items: center;
			justify-content: center;

			img {
				background: #82a9f9;
				border-radius: 1.9rem;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 1.5rem;
				height: 1.5rem;
			}
		}

		.title {
			font-weight: 500;
			font-size: 0.54rem;
			color: #121212;
			text-align: center;
			margin-top: 1rem;
		}

		.info {
			margin: auto;
			width: 4rem;
			font-weight: 500;
			font-size: 0.36rem;
			text-align: center;
			color: #a6a6a6;
		}
	}

	.btn-list {
		.van-button {
			margin-top: 20px;
		}
	}

	:deep(.popup-css) {
		border-radius: 20px;
		width: 90%;
		background: #fff;

		.dialog-title {
			border-bottom: 0.01rem dashed rgba(130, 169, 249, 0.2);

			.title-text {
				display: block;
				font-size: 44px;
				color: #121212;
				font-weight: 700;
			}
		}

		.el-dialog__body {
			.text {
				display: block;
				color: #b8b8b8;
				font-size: 28px;
				text-align: center;
				padding: 20px 0 40px;
			}
		}

		.dialog-footer {
			padding: 0 40px;
			display: flex;
			margin-bottom: 40px;

			.cancel-btn {
				margin-left: 20px;
			}
		}
	}

	:deep(.van-tabs__wrap) {
		height: 30px;
		border-radius: 9px 0px 0px 9px;
		margin-left:15px ;
	}

	:deep(.van-tab) {
		font-size: 14px;
		color: var(--vt-sub-black);
		font-weight: 500;
		margin: 0px 0.5px;
		padding: 5px 20px;
		border-radius: 26px;
	}

	:deep(.van-tab--active) {
		border-radius: 7px;
		background: var(--1233456, linear-gradient(180deg, rgba(216, 228, 252, 0.80) 0%, rgba(21, 177, 220, 0.80) 78%, rgba(60, 150, 223, 0.80) 100%));
		box-shadow: 0px 3px 8px 0px rgba(0, 0, 0, 0.12), 0px 3px 1px 0px rgba(0, 0, 0, 0.04);
		color: #fff;
	}

	:deep(.van-tabs__line) {
		display: none;
	}

	:deep(.van-tabs__nav) {
		padding-left:0px ;
		background: #DFDFDF;
	}
}

.scroll-container {
	overflow-x: auto;
	overflow-y: hidden;
	/* Hide vertical scrollbar */
	white-space: nowrap;
	/* Prevent items from wrapping to the next line */
	width: 100%;
	/* Adjust width as needed */
}
</style>
