<template>
	<div class="records_container custom-page full-page">
		<div>
			<van-nav-bar :fixed="true" :title="t('借款账户')" @click-left="onClickLeft" class="loan-title">
				<template #left>
					<van-icon :name="arrow" size="18" />
				</template>
			</van-nav-bar>
		</div>
		<!-- Card -->
		<div class="account">
			<div class="title">{{ t('您借款') }}</div>
			<div class="money">${{ toFixedDecimal(userLoanAmount || 0, 2) }}</div>
			<!-- ETH Today's Profit-->
			<div class="introduce" v-show="itemInfo.minLoanAmount">
				<span class="trends">{{ t('借款限额') }}: </span>
				<span class="trends">${{ itemInfo.minLoanAmount }} ~ ${{ itemInfo.maxLoanAmount }}</span>
			</div>
			<!-- Center Card -->
			<div class="range" v-if="userKycRecordData.approvalStatus === '-1'">
				<div class="right_font">
					<div class="divider"></div>
					<div class="question">{{ t('认证身份') }}!</div>
					<div class="info">{{ t('验证并获得更多贷款金额') }}</div>
				</div>
				<div class="next" @click="handleRouter('/verification')">
					<span>{{ t('开始') }}</span>
				</div>
			</div>
			<div class="range" v-else-if="userKycRecordData.approvalStatus === '0'">
				<div class="right_font">
					<div class="divider"></div>
					<div class="question">{{ t('待审核') }}</div>
					<div class="info">{{ t('请等待结果') }}</div>
				</div>
				<div class="next disabled">
					<span>{{ t('等待') }}</span>
				</div>
			</div>
			<div class="range" v-else-if="userKycRecordData.approvalStatus === '1'">
				<div class="right_font">
					<div class="divider"></div>
					<div class="question">{{ t('借款历史') }}</div>
					<div class="info">{{ t('管理您的贷款计划') }}</div>
				</div>
				<div class="next" @click="handleRouter('/loan-records')">
					<span>{{ t('查看') }}</span>
				</div>
			</div>
		</div>
		<div class="wrapper">
			<!-- Amount -->
			<div class="amount">
				<div class="title">{{ t('金额') }}</div>
				<van-cell-group inset>
					<van-field v-model.number="amount" type="number" :right-icon="USDC" :placeholder="t('我想借款')" />
				</van-cell-group>
			</div>
			<!-- Loan term (Days) -->
			<div class="term">
				<div class="title">{{ t('借款期限 (天)') }}</div>
				<van-dropdown-menu :overlay="false">
					<van-dropdown-item @change="changeItem" v-model="days" :options="daysList" />
				</van-dropdown-menu>
			</div>
			<!-- performce -->
			<div class="performce" v-show="itemInfo.loanDays">
				<div>
					<span>{{ t('每日利率') }}</span>
					<span style="color: #000">{{ timesForValueDecimal(itemInfo.loanDayRatio, 100) }} %</span>
				</div>
				<div>
					<span>{{ t('总利息金额') }}</span>
					<span style="color: #000">{{ totalInterest }} USDC</span>
				</div>
			</div>
			<!-- info -->
			<div class="info">
				<span>{{ t('贷款后{days}天内无需支付利息，之后需要支付利息。', { days: interestFreeDays }) }}</span>
			</div>
			<!-- Button -->
			<div class="Borrow">
				<van-button type="primary" @click="addLoad">{{ t('立即借款') }}</van-button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import arrow from '@/assets/images/user/arrow.png'
import USDC from '@/assets/images/user/USDC.png'
import { userStore } from '@/store'
import { fetchInterestFreeDaysApi, fetchLoanAccountInfoApi, getProdectList, userKycRecordLatestApi } from '@/apiService' // Import your API service
import { showToast } from 'vant'
import { useI18n } from 'vue-i18n'
import useLoading from '@/hooks/useLoading.js'
import { timesDecimal, timesForValueDecimal, toFixedDecimal } from '@/utils/index.js'

// 初始化仓库
const usersStore = userStore()
const { t } = useI18n()

// 变量区
const router = useRouter()
const route = useRoute()
const loading = useLoading()
// 下拉参数
const days = ref(1)
const daysList = ref([])
const allDays = ref([])
const itemInfo = ref({})
// amount
const amount = ref('')
// tab选中参数
const active = ref(0)
// tab数据
const tabList = ref([
	{
		label: 'Account',
		value: 0,
	},
	{
		label: 'Interest-bearing',
		value: 1,
	},
	{
		label: 'POS Staking',
		value: 2,
	},
])

// 代码区
const onClickLeft = () => {
	history.back()
	usersStore.SET_PATH_DATA('yes')
}
const getConfiguration = async () => {
	try {
		loading.loading()
		const response = await getProdectList() // Fetch data from API
		loading.clearLoading()
		allDays.value = response.data
		daysList.value = response.data.map((item) => {
			let obj = {
				text: item.loanDays + 'Days',
				value: item.id,
			}
			return obj
		})

		if (response.data.length) {
			itemInfo.value = allDays.value[0]
			days.value = allDays.value[0].id
		}
	} catch (err) {
		// Handle errors
	}
}
const changeItem = (val) => {
	days.value = val
	let filterInfo = allDays.value.filter((item) => {
		return item.id == days.value
	})
	itemInfo.value = filterInfo[0]
}
// 总利息 = 本金乘天乘日利率
const totalInterest = computed(() => {
	return timesDecimal(timesForValueDecimal(amount.value || 0, itemInfo.value.loanDays), itemInfo.value.loanDayRatio, 2)
})
const addLoad = async () => {
	if (!amount.value) {
		showToast({
			message: t('请输入借款金额'),
			icon: 'info',
		})
		return
	}
	if (amount.value < itemInfo.value.minLoanAmount || amount.value > itemInfo.value.maxLoanAmount) {
		showToast({
			message: t('核算金额范围', { min: itemInfo.value.minLoanAmount, max: itemInfo.value.maxLoanAmount }),
			icon: 'info',
		})
		return
	}
	if (userKycRecordData.value.approvalStatus !== '1') {
		showToast({
			message: t('需要kyc审核通过'),
			icon: 'info',
		})
		return
	}

	let dataInfo = {
		userId: usersStore.userInfo.id,
		loanProductId: days.value,
		loanAmount: amount.value,
		orderCurrency: 'USDC',
		loanProtocol: '',
		itemInfo: itemInfo.value,
	}
	console.log('dataInfo', dataInfo)

	usersStore.SET_STATE_DATA('loanOrder', dataInfo)
	usersStore.SET_PATH_DATA('no')
	router.push('/loan-detail')
	// try {
	//   const response = await addLoanOrder(dataInfo); // Fetch data from API
	//   allDays.value = response.data
	//   response.data.map((item) => {
	//     let obj = {
	//       text: item.loanDays + 'Days',
	//       value: item.id
	//     }
	//     daysList.value.push(obj)

	//   })
	//   itemInfo.value = allDays.value[0]

	// } catch (err) {
	//   // Handle errors
	// } finally {

	// }
}
//新增贷款
const onClickTab = ({ name }) => {
	active.value = name
}

// 路由跳转
const handleRouter = (path) => {
	usersStore.SET_PATH_DATA('no')
	router.push(`${path}`)
}
// PENDINGREVIEW("0", "待审核"), EXAMINATIONPASSED("1", "审核通过"), REVIEWREJECTED("2", "审核驳回");
const loanApprovalStatus = ref('0')
// null 开始验证
const kycApprovalStatus = ref(null)
const userInfo = ref({
	totalLoanAmount: '0',
})
const checkVerify = () => {
	loading.loading()
	usersStore
		.fetchUserInfoAction()
		.then((res) => {
			loading.clearLoading()
			if (res.data) {
				userInfo.value = res.data
				loanApprovalStatus.value = res.data?.loanApprovalStatus
				kycApprovalStatus.value = res.data?.kycApprovalStatus
			}
		})
		.finally(() => {})
}
// -1 未审核 0  审核中 1审核通过 2审核驳回
const userKycRecordData = ref({
	approvalStatus: '-1',
})
const userKycRecord = async () => {
	try {
		const params = {
			userId: usersStore.userInfo.id,
		}
		loading.loading()
		const res = await userKycRecordLatestApi(params)
		loading.clearLoading()
		if (res.data) {
			userKycRecordData.value = res.data
		}
	} catch (error) {
		console.log(error)
	}
}

const userLoanAmount = ref(0)
const getUserLoanAccountInfo = async () => {
	try {
		loading.loading()
		const response = await fetchLoanAccountInfoApi() // Fetch data from API
		loading.clearLoading()
		userLoanAmount.value = response.data
	} catch (err) {
		// Handle errors
		console.log(err)
	}
}

// 免息天数
const interestFreeDays = ref(0)
const getInterestFreeDays = async () => {
	try {
		loading.loading()
		const response = await fetchInterestFreeDaysApi() // Fetch data from API
		loading.clearLoading()
		interestFreeDays.value = response.data
	} catch (err) {
		// Handle errors
		console.log(err)
	}
}

onMounted(() => {
	usersStore.SET_PATH_DATA('no')
	userKycRecord()
	getConfiguration()
	getUserLoanAccountInfo()
	getInterestFreeDays()
})

// 将组件中的数据进行暴露出去
defineExpose({})
</script>

<style lang="scss" scoped>
.records_container {
	position: relative;

	padding-left: 48px;
	padding-right: 48px;

	//.loan-title {
	//	margin-top: 20px;
	//	margin-bottom: 20px;
	//}
	.account {
		margin-top: 20px;
		width: 100%;
		//height: 448px;
		background: url('../../../assets/images/earn/earnAccount.png') no-repeat;
		background-size: 100%;
		font-size: 25px;
		color: #fff;
		padding: 48px;
		// padding-top: 40px;
		// padding-left: 30px;
		.title {
		}

		.money {
			font-size: 70px;
			font-weight: 700;
		}
		.introduce {
		}
		.range {
			// width: 90%;
			background: #fff;
			//height: 1.6rem;
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin: 48px 0 0px;
			padding: 24px;
			border-radius: 20px;
			// transform: translateX(-52%);

			.right_font {
				flex: 1;
				color: #000;

				.question {
					font-weight: normal;
					font-size: 26px;
					margin-bottom: 10px;
				}

				.info {
					font-size: 25px;
					color: #999;
				}
			}

			.next {
				top: 50px;
				margin-right: 20px;
				padding: 0 20px;
				min-width: 96px;
				height: 54px;
				line-height: 54px;
				background: #82a8f9;
				border-radius: 40px;
				text-align: center;

				img {
					width: 100%;
					height: 100%;
				}
			}

			.disabled {
				opacity: 0.6;
			}
		}
	}

	.wrapper {
		border-radius: 32px;
		background: #fff;
	}

	.amount,
	.term {
		.title {
			font-size: 24px;
			margin-bottom: 16px;
			color: #999;
		}

		.van-cell-group--inset {
			margin: 0px;
			background: #f8f9fb;
			border-radius: 8px;

			.van-cell {
				background: #f8f9fb;
				height: 48px;
				:deep(.van-cell__value .van-field__body) {
					height: 100%;
				}
			}
		}

		::v-deep .van-icon__image {
			display: block;
			width: 2em;
			height: 1em;
			object-fit: contain;
		}
	}

	.term {
		margin-top: 56px;

		::v-deep .van-dropdown-menu__bar {
			border-radius: var(--van-cell-group-inset-radius);
		}

		:deep(.van-dropdown-menu__title:after) {
			border-color: transparent transparent #000000 #000000;
			right: -70px;
			width: 12px;
			height: 12px;
			margin-top: -7px;
		}

		:deep .van-dropdown-menu__bar {
			border-radius: 10px;
		}

		:deep .van-dropdown-item {
			margin: auto;
			width: 93%;
		}
		:deep(.van-cell__title) {
			margin-left: 13px;
		}
	}

	.performce {
		font-size: 24px;
		color: #999;
		margin-top: 54px;

		div {
			display: flex;
			justify-content: space-between;
			padding-bottom: 30px;
			margin-bottom: 34px;
			border-bottom: 1px solid rgba(185, 193, 217, 0.2);
		}
	}

	.info {
		font-size: 20px;
		color: #666;
		margin-top: 10px;
	}

	.Borrow {
		margin-top: 30px;
		margin-bottom: 80px;

		:deep .van-button--normal {
			width: 100%;
			border-radius: 30px;
			height: 52px;
			background: #82a8f9;
		}
	}
}

.van-cell {
	height: 40px;
}
</style>
