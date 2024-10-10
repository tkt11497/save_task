<template>
	<div class="records_container custom-page full-page">
		<div>
			<van-nav-bar :fixed="true" :title="t('借款账户')" @click-left="onClickLeft" class="loan-title">
				<template #left>
					<van-icon :name="arrow" size="23" />
				</template>
			</van-nav-bar>
		</div>
		<!-- Card -->
		<div class="account">
			<div class="title">{{ t('您借款') }}</div>
			<div class="money">${{ toFixedDecimal(userLoanAmount || 0, 2) }}</div>
			<!-- ETH Today's Profit-->
			<div class="introduce" v-show="changeProductInfo.amountMin">
				<span class="trends">{{ t('借款限额') }}: </span>
				<span class="trends">${{ changeProductInfo.amountMin }} ~ ${{ changeProductInfo.amountMax }}</span>
			</div>
			<!-- Center Card -->
			<div class="range" v-if="userKycRecordData.approvalStatus === '0'">
				<div class="right_font">
					<div class="divider"></div>
					<div class="question">{{ t('认证身份') }}!</div>
					<div class="info">{{ t('验证并获得更多贷款金额') }}</div>
				</div>
				<div class="next" @click="handleRouter('/verification')">
					<span>{{ t('开始') }}</span>
				</div>
			</div>
			<div class="range" v-else-if="userKycRecordData.approvalStatus === '2'">
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
					<van-field v-model.number="loanAmount" type="number" :placeholder="t('我想借款')">
						<template #right-icon>
							<span class="loanToken">{{ changeProductInfo.walletToken }}</span>
						</template>
					</van-field>
				</van-cell-group>
			</div>
			<!-- Loan term (Days) -->
			<div class="term">
				<div class="title">{{ t('借款期限 (天)') }}</div>
				<van-dropdown-menu :overlay="false">
					<van-dropdown-item @change="changeItem" v-model="changeProductId" :options="formatProductList" />
				</van-dropdown-menu>
			</div>
			<!-- performce -->
			<div class="performce" v-show="changeProductInfo.borrowDay">
				<div>
					<span>{{ t('每日利率') }}</span>
					<span style="color: #000">{{ changeProductInfo.dayRate }} %</span>
				</div>
				<div>
					<span>{{ t('总利息金额') }}</span>
					<span style="color: #000">{{ totalInterest }} {{ changeProductInfo.walletToken }}</span>
				</div>
			</div>
			<!-- info -->
			<div class="info" v-if="changeProductInfo.interestFreeDays">
				<span>{{ t('贷款后{days}天内无需支付利息，之后需要支付利息。', { days: changeProductInfo.interestFreeDays }) }}</span>
			</div>
			<!-- Button -->
			<div class="Borrow">
				<van-button block round type="primary" @click="addLoad">{{ t('立即借款') }}</van-button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import arrow from '@/assets/images/market/back.svg'
import { userStore } from '@/store'
import { showToast } from 'vant'
import { useI18n } from 'vue-i18n'
import useLoading from '@/hooks/useLoading.js'
import { dividedForValueDecimal, timesDecimal, timesForValueDecimal, toFixedDecimal } from '@/utils/index.js'
import { fetchLoanProductListApi, fetchUserLoanAmountApi } from '@/apis/loan.js'
import { storeToRefs } from 'pinia'

// 初始化仓库
const usersStore = userStore()
const { userInfo } = storeToRefs(usersStore)
const { t } = useI18n()

// 变量区
const router = useRouter()
const route = useRoute()
const loading = useLoading()

// 代码区
const onClickLeft = () => {
	history.back()
	usersStore.SET_PATH_DATA('yes')
}

// 选中的产品Id
const changeProductId = ref(0)
// 选中的产品信息
const changeProductInfo = ref({})
// 产品列表
const productList = ref([])
// 格式化后的产品列表
const formatProductList = computed(() => {
	return productList.value.map((item) => {
		return {
			text: `${item.borrowDay}${t('天')}`,
			value: item.productId,
		}
	})
})
// 获取借贷产品列表
const getLoanProductList = async () => {
	try {
		loading.loading()
		const response = await fetchLoanProductListApi() // Fetch data from API
		loading.clearLoading()
		productList.value = response.data || []

		if (response.data.length) {
			changeProductInfo.value = productList.value[0]
			changeProductId.value = productList.value[0].productId
		}
	} catch (err) {
		// Handle errors
	}
}
const changeItem = (val) => {
	changeProductId.value = val
	let filterInfo = productList.value.find((item) => {
		return item.productId === changeProductId.value
	})
	changeProductInfo.value = filterInfo || {}
}

// 借贷金额
const loanAmount = ref(0)
// 总利息 = 本金/100*天*日利率
const totalInterest = computed(() => {
	return timesDecimal(
		timesForValueDecimal(loanAmount.value || 0, changeProductInfo.value.borrowDay),
		dividedForValueDecimal(changeProductInfo.value.dayRate, 100),
		2
	)
})
const addLoad = async () => {
	if (!loanAmount.value) {
		showToast({
			message: t('请输入借款金额'),
			icon: 'info',
		})
		return
	}
	if (loanAmount.value < changeProductInfo.value.amountMin || loanAmount.value > changeProductInfo.value.amountMax) {
		showToast({
			message: t('核算金额范围', { min: changeProductInfo.value.amountMin, max: changeProductInfo.value.amountMax }),
			icon: 'info',
		})
		return
	}

	await userKycRecord()
	if (userKycRecordData.value.approvalStatus !== '1') {
		showToast({
			message: t('需要kyc审核通过'),
			icon: 'info',
		})
		return
	}

	let dataInfo = {
		userId: usersStore.userInfo.id,
		loanProductId: changeProductId.value,
		loanAmount: loanAmount.value,
		orderCurrency: changeProductInfo.walletToken,
		loanProtocol: '',
		changeProductInfo: changeProductInfo.value,
	}

	usersStore.SET_STATE_DATA('loanOrder', dataInfo)
	usersStore.SET_PATH_DATA('no')
	router.push('/loan-detail')
}

// 路由跳转
const handleRouter = (path) => {
	usersStore.SET_PATH_DATA('no')
	router.push(`${path}`)
}

// 默认是0 ，上传了是 2  审核了是 1
const userKycRecordData = ref({
	approvalStatus: '0',
})
// 查询用户是否申请过kyc
const userKycRecord = async () => {
	try {
		loading.loading()
		await usersStore.loginAction()
		userKycRecordData.value.approvalStatus = userInfo.value.isKyc + ''
		loading.clearLoading()
	} catch (error) {
		console.log(error)
	}
}

// 借款金额
const userLoanAmount = ref(0)
const getUserLoanAccountInfo = async () => {
	try {
		loading.loading()
		const response = await fetchUserLoanAmountApi() // Fetch data from API
		loading.clearLoading()
		userLoanAmount.value = response.data
	} catch (err) {
		console.log(err)
	}
}

onMounted(() => {
	usersStore.SET_PATH_DATA('no')

	userKycRecord()
	getLoanProductList()
	getUserLoanAccountInfo()
})

// 将组件中的数据进行暴露出去
defineExpose({})
</script>

<style lang="scss" scoped>
.records_container {
	position: relative;

	padding-left: 48px;
	padding-right: 48px;
	background-image: url("@/assets/images/background/sbg_2.png");
	background-position:  top;
	background-size: 140% 110%;

	//.loan-title {
	//	margin-top: 20px;
	//	margin-bottom: 20px;
	//}
	.account {
		margin-top: 20px;
		width: 100%;
		//height: 448px;
		background: url('@/assets/images/home/card_all.png') no-repeat;
		background-size: 100%;
		font-size: 25px;
		color: var(--vt-header-black);
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
			border-top: 1.5px solid #FFF;
			background: linear-gradient(270deg, rgba(153, 153, 153, 0.7) 0%, rgba(255, 255, 255, 0.7) 100%);
			backdrop-filter: blur(25.368999481201172px);
			box-shadow: 0px 2px 4.4px 0px rgba(0, 0, 0, 0.15);

			display: flex;
			align-items: center;
			justify-content: space-between;
			margin: 48px 0 0px;
			padding: 24px;
			border-radius: 0.33333rem;
			// transform: translateX(-52%);

			.right_font {
				flex: 1;
				color: var(--vt-header-black);
				font-weight: 500;

				.question {
					font-weight: 500;
					font-size: 26px;
					margin-bottom: 10px;
				}

				.info {
					font-size: 25px;
					color: var(--vt-sub-black);
				}
			}

			.next {
				top: 50px;
				margin-right: 20px;
				padding: 0 20px;
				min-width: 96px;
				height: 54px;
				line-height: 54px;
				background: linear-gradient(180deg, #93B6FF 0%, #75D3FF 83%, #35DCE8 100%);
				color: #fff;
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
		background: transparent;
	}

	.amount,
	.term {
		.title {
			font-size: 24px;
			margin-bottom: 16px;
			font-weight: 500;
			color: var(--vt-sub-black);
		}

		.van-cell-group--inset {
			margin: 0px;
			background: transparent;
			box-shadow: 0px 2px 4.4px 1px rgba(0, 0, 0, 0.15);
			border-radius: 8px;

			.van-cell {
				background: linear-gradient(270deg, rgba(153, 153, 153, 0.50) 0%, rgba(255, 255, 255, 0.50) 100%);
				height: 48px;
				:deep(.van-cell__value .van-field__body) {
					height: 100%;
				}
			}
		}

		.loanToken {
			color: var(--vt-header-black);
			font-weight: 500;
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
			border-top: 1.5px solid #FFF;
			background: linear-gradient(270deg, rgba(153, 153, 153, 0.3) 0%, rgba(255, 255, 255, 0.3) 100%);
			box-shadow: 0px 2px 4.4px 0px rgba(0, 0, 0, 0.15);
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
		color: var(--vt-sub-black);
		font-weight: 500;
		margin-top: 54px;

		div {
			display: flex;
			justify-content: space-between;
			padding-bottom: 30px;
			margin-bottom: 34px;
			border-bottom: 1px solid #645A6F;
		}
	}

	.info {
		font-size: 20px;
		color: var(--vt-sub-black);
		font-weight: 500;
		margin-top: 10px;
	}

	.Borrow {
		margin-top: 30px;
		margin-bottom: 80px;
		.van-button{
			background-image: url("@/assets/images/market/p_button.png");
			background-position:  center;
			background-size: 110% 130%;
			border:none;
		}
	}
}

.van-cell {
	height: 40px;
}
</style>
