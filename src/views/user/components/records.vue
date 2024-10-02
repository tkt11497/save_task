<template>
	<div class="records_container custom-page">
		<div>
			<van-nav-bar :fixed="true" :title="t('记录')" @click-left="onClickLeft">
				<template #left>
					<van-icon :name="arrow" size="18" />
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
				<div v-show="activeName == 3">
					<!-- ================= 期权 ==================== -->
					<div v-if="optionList.length == 0" class="container">
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
								<p class="day-text">{{ list.productCode.toUpperCase() }}</p>
								<img v-if="list.userType == 1" src="@/assets/images/record/shield-01.png" class="img-css success-img" alt="notice" />
								<img v-if="list.userType == 0" src="@/assets/images/record/shield-02.png" class="img-css" alt="notice" />
								<!-- <img src="@/assets/images/user/record-blue.png" class="img-css" alt="notice"> -->
								<!-- <img src="../../../assets/images/user/record-red.png" class="img-css" alt="notice"> -->
							</div>
							<div class="content-row">
								<p class="left-text">{{ t('类型') }}:</p>
								<p class="right-text uptext" v-if="list.userType == 1">{{ t('上涨') }}</p>
								<p class="right-text downtext" v-if="list.userType == 0">{{ t('下跌') }}</p>
							</div>
							<div class="content-row">
								<p class="left-text">{{ t('金额') }}:</p>
								<p class="right-text">{{ toFixedDecimal(list.orderAmount || 0, 8) }}{{ list.orderCurrency }}</p>
							</div>
							<div class="content-row">
								<p class="left-text">{{ t('开盘价格') }}:</p>
								<p class="right-text">{{ list.openPrice }}</p>
							</div>
							<div class="content-row">
								<p class="left-text">{{ t('当前价格') }}:</p>
								<p class="right-text">{{ list.currentPrice }}</p>
							</div>
							<div class="content-row">
								<p class="left-text">{{ t('时间') }}:</p>
								<p class="right-text">{{ list.period || 0 }}s</p>
							</div>
							<div class="content-row">
								<p class="left-text">{{ t('费用') }}:</p>
								<p class="right-text">${{ list.transactionFee }}</p>
							</div>
							<div class="content-row">
								<p class="left-text">{{ t('预期') }}:</p>
								<p class="right-text">{{ list.lossAmountPrice }}{{ list.orderCurrency }}</p>
							</div>
							<div class="content-row">
								<p class="left-text">{{ t('创建时间2') }}:</p>
								<p class="right-text">{{ list.createTime }}</p>
							</div>
						</div>
					</div>
				</div>

				<van-pull-refresh v-show="activeName != 3" v-model="refreshing" @refresh="onRefresh" :loosing-text="t('释放即可刷新')">
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
						<div v-if="activeName == 0">
							<!-- =======================账户======================= -->
							<div v-if="!listError && accountList.length == 0" class="container">
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
									<div class="title1-row" v-if="orderTypeArr[list.changeType]">
										<img :src="orderTypeArr[list.changeType].img" class="img-css" alt="notice" />
										<span>
											<p class="day-text">{{ orderTypeArr[list.changeType].label }}</p>
										</span>
									</div>
									<div class="title1-row" v-else>
										<img :src="orderTypeArr.default.img" class="img-css" alt="notice" />
										<span>
											<p class="day-text">{{ orderTypeArr.default.label }}</p>
										</span>
									</div>

									<div class="content-row">
										<p class="left-text">{{ t('发币') }}:</p>
										<p class="right-text">{{ toFixedDecimal(list.changeAmount, 8) }} {{ list.currency }}</p>
									</div>
									<div class="content-row">
										<p class="left-text">{{ t('收币') }}:</p>
										<p class="right-text">{{ toFixedDecimal(list.receiveCoinAmount, 8) }} {{ list.receiveCoinName }}</p>
									</div>
									<div class="content-row">
										<p class="left-text">{{ t('时间') }}:</p>
										<p class="right-text">{{ list.changeTime }}</p>
									</div>
									<!-- <div class="content-row">
                    <p class="left-text">Status:</p>
                    <p class="right-text">{{list.todayIncome}}</p>
                  </div> -->
								</div>
							</div>
						</div>
						<div v-else-if="activeName == 1">
							<!-- ================= 理财 计息 ==================== -->
							<div v-if="!listError && financialClientList.length == 0" class="container">
								<div class="notice">
									<img src="@/assets/images/user/notice.png" alt="notice" />
								</div>
								<div class="title">{{ t('哎呀！') }}</div>
								<div class="info">
									{{ t('您还没有任何交易。') }}
								</div>
								<div class="info">{{ t('列表为空') }}</div>
							</div>
							<div v-else class="each-block" v-for="(list, ind1) in financialClientList" :key="ind1">
								<div class="each-container">
									<div class="title-row title-row1">
										<p class="day-text">{{ list.financialManagementDays }}{{ $t('天') }}</p>
										<img src="@/assets/images/user/verified_user.svg" class="img-css" alt="notice" />
									</div>
									<div class="content-row">
										<p class="left-text">{{ t('金额') }}:</p>
										<p class="right-text">{{ toFixedDecimal(list.investAmount, 8) }} {{ list.financialCurrency }}</p>
									</div>
									<div class="content-row">
										<p class="left-text">{{ t('期限') }}:</p>
										<p class="right-text">{{ list.financialManagementDays }}{{ $t('天') }}</p>
									</div>
									<div class="content-row">
										<p class="left-text">{{ t('质押收益') }}:</p>
										<p class="right-text">
											{{ timesForValueDecimal(list.minRateInterest, 100) }}-{{ timesForValueDecimal(list.maxRateInterest, 100) }}%
										</p>
									</div>
									<div class="content-row">
										<p class="left-text">{{ t('今天的收入') }}:</p>
										<p class="right-text">{{ toFixedDecimal(list.todayIncome || 0, 8) }} {{ list.financialCurrency }}</p>
									</div>
									<div class="content-row">
										<p class="left-text">{{ t('总收入') }}:</p>
										<p class="right-text">{{ toFixedDecimal(list.todayRevenue || 0, 8) }} {{ list.financialCurrency }}</p>
									</div>
									<div class="content-row">
										<p class="left-text">{{ t('订单编号') }}:</p>
										<p class="right-text">{{ list.orderNumber }}</p>
									</div>
									<div class="content-row">
										<p class="left-text">{{ t('创建时间') }}:</p>
										<p class="right-text">{{ list.createTime }}</p>
									</div>
									<div class="content-row">
										<p class="left-text">{{ t('到期日期') }}:</p>
										<p class="right-text">{{ list.expireDate }}</p>
									</div>
								</div>
								<!-- 0 or '0'? -->
								<div class="confirm-btn confirm-btn2" v-if="list.earlyRedemptionButton">
									<el-button plain @click="showInterestPopupFunc(list)" class="btn-css">
										<p class="">{{ t('赎回') }}</p>
									</el-button>
								</div>
							</div>
						</div>
						<div v-else-if="activeName == 2">
							<!-- ================= 质押 ==================== -->
							<div v-if="!listError && pledgeClientList.length == 0" class="container">
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
										<!-- <p class="day-text">{{list.pledgeType}}</p> -->
										<span v-for="item in PledgeTypeArr" :key="item">
											<span v-if="item.value == list.pledgeType">
												<p class="day-text">{{ item.label }}</p>
											</span>
										</span>
										<img src="@/assets/images/record/shield-01.png" class="img-css success-img" :width="18" :height="22" alt="notice" />
									</div>
									<div class="content-row">
										<p class="left-text">{{ t('金额') }}:</p>
										<p class="right-text">{{ list.pledgeAmount }} {{ list.baseSymbol }}</p>
									</div>
									<div class="content-row">
										<p class="left-text">{{ t('收益') }}:</p>
										<p class="right-text">
											{{ timesForValueDecimal(list.minMassInterestRatio, 100) }}-{{ timesForValueDecimal(list.maxMassInterestRatio, 100) }}%
										</p>
									</div>
									<div class="content-row">
										<p class="left-text">{{ t('今天的收入') }}:</p>
										<p class="right-text">+{{ toFixedDecimal(list.todayIncome || 0, 8) }} {{ list.baseSymbol }}</p>
									</div>
									<div class="content-row">
										<p class="left-text">{{ t('总收入') }}:</p>
										<p class="right-text">{{ toFixedDecimal(list.totalProfit || 0, 8) }} {{ list.baseSymbol }}</p>
									</div>
									<div class="content-row">
										<p class="left-text">{{ t('质押时间') }}:</p>
										<p class="right-text">{{ list.startTime }}</p>
									</div>
									<div class="content-row">
										<p class="left-text">{{ t('释放时间') }}:</p>
										<p class="right-text">{{ list.expirationTime }}</p>
									</div>
								</div>
								<div class="confirm-btn confirm-btn2" v-if="list.earlyExitButton">
									<el-button plain @click="showPopupFunc(list)" class="btn-css">
										<p class="">{{ t('赎回') }}</p>
									</el-button>
								</div>
							</div>
						</div>
						<div v-else-if="activeName == 4">
							<!-- ================= 合约 ==================== -->
							<div v-if="!listError && contractList.length == 0" class="container">
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
								<div v-if="list.orderStatus !== '2'" class="confirm-btn confirm-btn2">
									<el-button plain @click="manualClosePosition(list)" class="btn-css">
										<p class="">{{ t('平仓') }}</p>
									</el-button>
								</div>
							</div>
						</div>
					</van-list>
				</van-pull-refresh>
			</div>
			<!-- 质押赎回确认 -->
			<div class="confirm-btn">
				<el-dialog v-model="centerDialogVisible" width="350" align-center class="popup-css">
					<template #header>
						<div class="dialog-title">
							<!-- <img src="@/assets/images/user/warning.png" class="waning-css" alt="notice"> -->
							<span class="title-text">⚠ {{ t('警告') }}</span>
						</div>
					</template>
					<span class="text">
						{{
							t('如果提前终止交易，您将支付本金{比例}%的罚款，这是 {金额}。', {
								rate: timesDecimal(pledgeEmissionRate, 100, 2),
								amount: timesDecimal(eachData.pledgeAmount, pledgeEmissionRate),
								baseSymbol: eachData.baseSymbol,
							})
						}}
					</span>
					<template #footer>
						<div class="dialog-footer">
							<el-button :plain="true" @click="putFinancialData()" class="confirm1-btn">{{ t('确认') }}</el-button>
							<el-button class="cancel-btn" @click="centerDialogVisible = false">{{ t('取消') }}</el-button>
						</div>
					</template>
				</el-dialog>
			</div>
			<!-- 理财 interest dialog Form -->
			<div class="confirm-btn">
				<el-dialog v-model="interestDialogVisible" width="350" align-center class="popup-css">
					<template #header>
						<div class="dialog-title">
							<!-- <img src="@/assets/images/user/warning.png" class="waning-css" alt="notice"> -->
							<span class="title-text">⚠ {{ t('警告') }}</span>
						</div>
					</template>
					<span class="text">
						{{
							t('如果提前终止交易，您将支付本金{比例}的罚款，这是 {金额}。', {
								rate: timesDecimal(interestEmissionRate, 100, 2),
								amount: timesDecimal(eachData.investAmount, interestEmissionRate),
								baseSymbol: eachData.financialCurrency,
							})
						}}
					</span>
					<template #footer>
						<div class="dialog-footer">
							<el-button :plain="true" @click="updateInterestStakting()" class="confirm1-btn">{{ t('确认') }}</el-button>
							<el-button class="cancel-btn" @click="interestDialogVisible = false">{{ t('取消') }}</el-button>
						</div>
					</template>
				</el-dialog>
			</div>
		</div>
	</div>
</template>

<script setup name="Records">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import arrow from '@/assets/images/user/arrow.png'
import { userStore } from '@/store'
import {
	fetchAccountPageList,
	fetchContractOrderList,
	fetchInterestDataList,
	fetchInterestEmissionRateApi,
	fetchPledgeEmissionRateApi,
	fetchPosStakingDataList,
	manualClosePositionApi,
	optionOrderClientList,
	updateInterestData,
	updatePosStaingData,
} from '@/apiService'
import { useI18n } from 'vue-i18n'
import useLoading from '@/hooks/useLoading.js'
import { timesDecimal, timesForValueDecimal, toFixedDecimal } from '../../../utils/index.js'
import { dayjs } from 'element-plus'
// 初始化仓库
const store = userStore()
const { t } = useI18n()
// 变量区
const router = useRouter()
const route = useRoute()
const loading = useLoading()
// tab选中参数
const activeName = ref('0')
const data = ref({
	'userId': store.userId,
})
const eachData = ref({})
const intervalId = ref(null)
const centerDialogVisible = ref(false)
const interestDialogVisible = ref(false)

const accountList = ref([])
const financialClientList = ref([])
const pledgeClientList = ref([])
const optionList = ref([])
const contractList = ref([])
// tab数据

const tabList = ref([
	{
		label: t('账户'),
		value: 0,
	},
	{
		label: t('计息'),
		value: 1,
	},
	{
		label: t('POS质押'),
		value: 2,
	},
	{
		label: t('期权2'),
		value: 3,
	},
	{
		label: t('合约'),
		value: 4,
	},
])
const PledgeTypeArr = ref([
	{
		label: t('个人质押'),
		value: '1',
	},
	{
		label: t('联合质押'),
		value: '0',
	},
])

const orderTypeArr = ref({
	'1': {
		label: t('充值'),
		value: '1',
		img: new URL(`@/assets/images/record/card-add.png`, import.meta.url).href,
	},
	'2': {
		label: t('提现'),
		value: '2',
		img: new URL(`@/assets/images/record/card-minus.png`, import.meta.url).href,
	},
	'20': {
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

	// 非期权tab，清空期权轮询，开始分页查询
	if (name !== 3) {
		stopPolling()

		onRefresh()
	} else {
		pageData.value.pageNum = 0
		getOptionList()
	}
}
// list 滚动加载
const pageData = ref({
	pageSize: 20,
	pageNum: 0,
	total: 0,
})
const listError = ref(false)
const listLoading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const isEmptyList = ref(false)
const onLoad = async () => {
	try {
		isEmptyList.value = false

		if (refreshing.value) {
			refreshing.value = false
		}

		let currentList, fetchApi
		if (activeName.value == 0) {
			fetchApi = showTuserList
			currentList = accountList
		} else if (activeName.value == 1) {
			fetchApi = getInterestList
			currentList = financialClientList
		} else if (activeName.value == 2) {
			fetchApi = getPosStakingDataList
			currentList = pledgeClientList
		} else if (activeName.value == 4) {
			fetchApi = getContractOrderList
			currentList = contractList
		}

		if (pageData.value.pageNum == 0) {
			currentList.value = []
			pageData.value.total = 0
			finished.value = false
		}

		const response = await fetchApi({
			pageSize: pageData.value.pageSize,
			pageNum: pageData.value.pageNum + 1,
		})

		listError.value = false
		pageData.value.pageNum += 1
		pageData.value.total = response.total

		if (currentList.value.length >= response.total) {
			finished.value = true
		} else {
			finished.value = false
		}
		if (!response.total) {
			isEmptyList.value = true
		}
	} catch (e) {
		listError.value = true
	} finally {
		listLoading.value = false
	}
}

const onRefresh = async () => {
	// 清空列表数据
	finished.value = false
	listLoading.value = true
	// 重新加载数据
	pageData.value.pageNum = 0
	onLoad()
}

const showTuserList = async (pageData) => {
	try {
		const response = await fetchAccountPageList(pageData)
		accountList.value = accountList.value.concat(response.rows || [])
		return response
	} catch (err) {
		console.log(err)
		throw err
	}
}

const getInterestList = async (pageData) => {
	try {
		const response = await fetchInterestDataList({
			...data.value,
			...pageData,
		}) // Fetch data from API
		// daysList.value = response.data;
		financialClientList.value = financialClientList.value.concat(response.rows || [])
		console.log('Records Financial client list is ')
		return response
	} catch (err) {
		console.log(err)
		throw err
	}
}

// 理财订单  是否可以提前赎回
const isEarlyRedemption = (data) => {
	// earlyRedemptionTime() 无值 并且 定单到期时间expireDate比现在晚
	return !data.earlyRedemptionTime && dayjs(data.expireDate).isAfter(Date.now())
}

// const getPledgeOrderList = async () => {
const getPosStakingDataList = async (pageData) => {
	try {
		// const response = await fetchPledgeOrderClientList(data.value);
		const response = await fetchPosStakingDataList({
			...data.value,
			...pageData,
		})
		console.log('Records Financial client list is ')
		pledgeClientList.value = pledgeClientList.value.concat(response.rows || [])
		return response
	} catch (err) {
		console.log(err)
		throw err
	}
}
// Function to stop polling
const stopPolling = () => {
	if (intervalId.value) {
		clearInterval(intervalId.value)
		intervalId.value = null // Reset the interval ID
	}
}
const getOptionList = async () => {
	try {
		if (!intervalId.value) {
			loading.loading()
		}
		const response = await optionOrderClientList({
			pageNum: 1,
			pageSize: 1000,
		}) // Fetch data from API
		if (!intervalId.value) {
			loading.clearLoading()
		}

		optionList.value = response.rows || []
	} catch (err) {
		console.log(err)
	}
	// Start polling if no interval is already set
	if (!intervalId.value) {
		intervalId.value = setInterval(() => {
			getOptionList()
		}, 2000)
	}
}
const getContractOrderList = async (pageData) => {
	try {
		const response = await fetchContractOrderList({
			...data.value,
			...pageData,
		})
		contractList.value = contractList.value.concat(response.rows || [])
		return response
	} catch (err) {
		console.error(err)
		throw err
	}
}
// ========= 质押赎回 begin ============
// 质押赎回罚款
const pledgeEmissionRate = ref(0)
// Update Popup form for Pos Staking
const showPopupFunc = async (list) => {
	try {
		loading.loading()
		const response = await fetchPledgeEmissionRateApi()
		pledgeEmissionRate.value = response.data || 0
		loading.clearLoading()
		eachData.value = list
		centerDialogVisible.value = true
	} catch (e) {
		console.log(e)
	}
}

// 确认提前赎回理财单
const putFinancialData = async () => {
	let temp = {
		pledgeOrderNo: eachData.value.pledgeOrderNo,
	}
	try {
		loading.loading()
		const response = await updatePosStaingData(temp)
		loading.clearLoading()
		centerDialogVisible.value = false

		onClickTab({ name: 2 })
	} catch (error) {
		console.log(error)
	}
}
// ========= 质押赎回 end ============

// ========= 理财赎回 begin ============
// 理财赎回罚款
const interestEmissionRate = ref(0)
// update dialog interest
const showInterestPopupFunc = async (list) => {
	try {
		loading.loading()
		const response = await fetchInterestEmissionRateApi()
		loading.clearLoading()
		interestEmissionRate.value = response.data || 0
		eachData.value = list
		interestDialogVisible.value = true
	} catch (e) {
		console.log(e)
	}
}

const updateInterestStakting = async () => {
	let temp = {
		id: eachData.value.id,
	}
	console.log('update insterest staking data', eachData.value.id)
	try {
		loading.loading()
		const response = await updateInterestData(temp)
		loading.clearLoading()
		interestDialogVisible.value = false

		onClickTab({ name: 1 })
	} catch (error) {
		console.log(error)
	}
}

// ========= 理财赎回 end ============

// 平仓
const manualClosePosition = async (item) => {
	try {
		const params = {
			id: item.id,
		}
		loading.loading()
		const res = await manualClosePositionApi(params)
		loading.clearLoading()

		onClickTab({ name: 4 })
	} catch (error) {
		console.log(error)
	}
}

onMounted(() => {
	store.SET_PATH_DATA('no')

	let currentTab = 0
	if (route.query?.tab) {
		currentTab = route.query.tab * 1
	}
	onClickTab({ name: currentTab })
})

onUnmounted(() => {
	stopPolling()
})

// 将组件中的数据进行暴露出去
defineExpose({})
</script>

<style>
.el-dialog__headerbtn {
	display: none;
}

.el-dialog__header.show-close {
	padding-right: 0;
}

.el-dialog__body {
	width: 85%;
	margin: auto;
}

.el-message--info {
	width: 70%;
}

.el-icon svg {
	display: none;
}

.el-message__content {
	padding-left: 5px;
	font-size: 18px;
}

.el-message .el-message-icon--info {
	background: url('../../../assets/images/user/info.png') no-repeat center center;
	background-size: 100%;
}
</style>
<style scoped>
.el-dialog {
	padding: 1rem 2rem;
	border-radius: 8px;
}

.popup-css {
	width: 90%;
	border-radius: 8px;
}

.el-dialog__footer {
	text-align: center;
}

.tabs-wrapper {
	margin-top: 40px;
	overflow-x: auto;
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

.van-tabs {
	display: inline-flex;
	/* Keep tabs in a single line */
}
</style>
<style lang="scss" scoped>
.records_container {
	position: relative;
	padding-bottom: 20px;
	background: #f5f5f5;
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

		.each-block {
			background: #fff;
			padding: 34px;
			margin-bottom: 32px;
			border-radius: 32px;

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
					color: #000;
					font-size: 28px;
					font-weight: 500;
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

				.left-text {
					font-size: 24px;
					font-weight: 400;
					color: #999;
				}

				.right-text {
					font-size: 24px;
					font-weight: 500;
					color: #000;
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
			}

			.title-row {
				position: relative;
				padding-left: 20px;
			}

			.title-row1::before {
				content: '';
				position: absolute;
				top: 50%;
				margin-top: -16px;
				left: 0;
				width: 8px;
				height: 32px;
				background-color: #7ba9ff;
				border-radius: 0.3rem;
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

	.confirm-btn {
		text-align: center;

		.btn-css {
			color: #fff;
			height: 1rem;
			background: var(--01, #82a9f9);
			border-radius: 0.45rem;
			width: 90%;
		}

		.btn-css:focus {
			background: #1d2a5e;
			background: var(--01, #82a9f9);
		}

		.waning-css {
			width: 24px;
			height: 24px;
		}

		.title-text {
			font-size: 24px;
		}

		.dialog-footer {
			text-align: center;
		}
	}

	.confirm-btn2 {
		margin-top: 40px;
		.btn-css {
			height: 112px;
			border-radius: 50px;
			font-size: 32px;
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

			.el-button {
				flex: 1;
				border-radius: 50px;
				font-size: 32px;
				font-weight: 700;
				height: 96px;
				background: #fff;
				border: #82a9f9 0.01rem solid;
				color: #82a9f9;
			}

			.confirm1-btn {
				margin-right: 60px;
			}

			.cancel-btn {
				background-color: #82a9f9;
				color: #fff;
			}
		}
	}

	:deep(.van-tabs__wrap) {
		height: initial;
	}

	::v-deep .van-tab {
		background: #fff;
		border: 1px solid #fff;
		margin: 0px 7px;
		padding: 5px 20px;
		border-radius: 26px;
	}

	::v-deep .van-tab--active {
		//padding: 5px 20px;
		//border-radius: 26px;
		background: #d8e4fd;
		color: #82a9f9;
	}

	::v-deep .van-tabs__line {
		display: none;
	}

	::v-deep .van-tabs__nav {
		background: transparent;
		padding-left: 16px;
		padding-right: 16px;
	}

	::v-deep a:focus,
	::v-deep input:focus,
	::v-deep button:focus,
	::v-deep textarea:focus,
	::v-deep [class*='van-']:focus {
		outline: none;
		background: #d9e5fd !important;
	}
}

.confirm1-btn {
	color: #000000;
	background: #f4f4f4;
	border-radius: 32px;
	width: 160px;
	border: 1px solid #000;
	font-weight: 400;
}

.cancel-btn {
	color: #fff;
	background: #1e2b5f;
	border-radius: 32px;
	width: 160px;
	border: 1px solid #000;
	font-weight: 400;
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
