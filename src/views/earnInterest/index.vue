<template>
	<div class="earn_onterset_container">
		<!-- Earn Interset -->
		<div class="header">
			<div class="left">
				<div class="time">{{ t('过去24小时') }}</div>
				<div class="title">{{ t('赚取利息') }}</div>
			</div>
			<div class="right">
				<span>{{ '+0.00%' }}</span>
				<div class="img">
					<img src="../../assets/images/home/moving.png" alt="trends" />
				</div>
			</div>
		</div>
		<!-- Card -->
		<div class="account">
			<div class="title">{{ t('赚取利息') }} {{ t('账户') }}</div>
			<div class="money">
				${{ plusDecimal(earnInterestAccountInfo.stakingAmount || '0') }}
				<!--				<span>ETH</span>-->
			</div>
			<!-- ETH Today's Profit-->
			<div class="introduce">
				<div class="trend">
					<img src="../../assets/images/home/trends2.svg" alt="trends" />
				</div>
				<span class="trends">${{ plusDecimal(earnInterestAccountInfo.stakingDayIncome || '0') }} </span>
				<!--				<span class="trends">Eth</span>-->
				<span class="day"> {{ t('今日盈利') }}</span>
			</div>
			<!-- Center Card -->
			<div class="range">
				<div class="icon">
					<!-- <img src="../../assets/images/earn/range_icon.png" alt="range_icon" /> -->
					<img src="../../assets/images/earn/earnIntersetTrading.svg" alt="range_icon" />
				</div>
				<div class="right_font">
					<div class="divider"></div>
					<div class="question">{{ t('什么是自动交易？') }}</div>
					<div class="info">{{ t('了解如何赚取利息') }}</div>
				</div>
				<div class="next" @click="handleRouter">
					<img src="../../assets/images/earn/next.png" alt="next" />
				</div>
			</div>
		</div>
		<!-- Earn Interest Start -->
		<div class="scroll_title">{{ t('赚取利息') }}</div>
		<!-- <div class="info">
        <div class="info_box" v-for="(item, index) in infoList" :key="index">
          <div class="icon">
            <img :src="item.icon" alt="info1">
          </div>
          <div class="content">{{ item.content }} </div>
        </div>
      </div> -->
		<div class="info">
			<van-swipe class="my-swipe" :width="126" :height="130" :show-indicators="false" :loop="false">
				<!--				<template v-for="(item, index) in infoList">-->
				<van-swipe-item v-for="(item, index) in infoList" :key="index">
					<div class="info_box break-word">
						<div class="icon">
							<img :src="item.icon" alt="info1" />
						</div>
						<div class="content">{{ item.content }}</div>
					</div>
				</van-swipe-item>
				<!--				</template>-->
			</van-swipe>
		</div>
		<!-- Earn Interest End -->
		<!-- footer -->
		<div class="footer">
			<!-- Staking Period -->
			<div class="pledge-days-select">
				<div class="title">{{ t('质押期限') }}</div>
				<!-- Days Select -->
				<div class="select">
					<el-select
						v-model="selectedDay"
						:placeholder="t('选择天数')"
						class="custom-select pledge-days"
						popper-class="custom-select-popper pledge-days"
					>
						<el-option v-for="(item, index) in formattedDaysList" :key="item.value" :label="item.leftText" :value="item.value">
							<template #default="{ option }">
								<span class="left-content">{{ item.leftText }}</span>
								<span class="right-content">{{ item.rightText }}</span>
							</template>
						</el-option>
					</el-select>
				</div>
			</div>
			<!-- Staking Amount -->
			<div class="pledge-currency-input">
				<div class="title">{{ t('质押金额') }}:</div>
				<!-- USDC Select And Input -->
				<div class="input">
					<div class="select">
						<el-select
							v-model="selectCoinOption"
							placeholder=""
							class="custom-select pledge-currency"
							popper-class="custom-select-popper pledge-currency"
						>
							<el-option v-for="item in coinOptions" :key="item.value" :label="item.text" :value="item.value">
								<template #default="{ option }">
									<img :src="item.image" alt="icon" class="option-image" />
									<span class="option-text">{{ item.text }}</span>
								</template>
							</el-option>
							<template #prefix>
								<img :src="selectedCoinItem?.image" alt="icon" class="option-image" />
							</template>
						</el-select>
					</div>
					<div class="fied">
						<van-cell-group inset>
							<van-field v-model="stakeAmount" type="number" placeholder="0.00" />
						</van-cell-group>
					</div>
				</div>
			</div>
			<!-- Yield And Limit -->
			<div class="rate">
				<div class="yield">
					<div class="title">{{ t('收益') }}:</div>
					<div v-if="currentFormatterDayInfo">
						{{ currentFormatterDayInfo.rightText }}
					</div>
				</div>
				<div class="limit">
					<div class="title">{{ t('限制') }}:</div>
					<div v-if="currentFormatterDayInfo && parseFloat(stakeAmount)">
						${{
							timesForValueDecimal(
								stakeAmount,
								timesForValueDecimal(currentFormatterDayInfo.day, dividedForValueDecimal(currentFormatterDayInfo.rateMin, 1000))
							)
						}}-{{
							timesForValueDecimal(
								stakeAmount,
								timesForValueDecimal(currentFormatterDayInfo.day, dividedForValueDecimal(currentFormatterDayInfo.rateMax, 1000))
							)
						}}
					</div>
				</div>
			</div>
			<!-- Subscribe Button -->
			<div class="subscribe" @click="showPopupFunc()">
				<van-button type="primary" block round>{{ t('订阅') }}</van-button>
			</div>
		</div>

		<div>
			<el-dialog v-model="centerDialogVisible" :show-close="false" width="calc(100vw - 30px)" align-center class="popup-css earn-order">
				<template #header>
					<div class="dialog-title">
						<img src="@/assets/images/home/rate.svg" alt="Custom Title" class="popup-image" />
					</div>
				</template>
				<div class="order_status">{{ t('订单状态') }}</div>
				<div class="order_info">{{ t('这是您的订单信息') }}</div>
				<div class="content">
					<div class="each-row">
						<p class="left-text">{{ t('质押金额') }}:</p>
						<p class="right-text">${{ stakeAmount }}</p>
					</div>
					<div class="each-row">
						<p class="left-text">{{ t('收益') }}:</p>
						<div class="right-text" v-if="currentFormatterDayInfo">
							<div>{{ currentFormatterDayInfo.rightText }}</div>
						</div>
					</div>
					<div class="each-row">
						<p class="left-text">{{ t('质押期限') }}:</p>
						<p class="right-text" v-if="currentFormatterDayInfo">
							{{ currentFormatterDayInfo.leftText }}
						</p>
					</div>
				</div>
				<template #footer>
					<div class="dialog-footer">
						<van-button block round type="primary" @click="addNew()" class="confirm1-btn">{{ t('确认') }}</van-button>
					</div>
				</template>
			</el-dialog>
		</div>
	</div>
</template>

<script setup name="EarnInterest">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { userStore } from '@/store'
import { showToast } from 'vant'
import { useI18n } from 'vue-i18n'
import { dividedForValueDecimal, getImageUrl, plusDecimal, timesForValueDecimal } from '@/utils'
import useLoading from '@/hooks/useLoading.js'
// 引入静态资源
import { addStakeOrder, fetchFinancialStakeListApi } from '@/apis/stake.js'
import { fetchFinancialStakeIncomeApi } from '@/apis/wallet.js'
import { useLoopFetchApi } from '@/hooks/useLoopApi.js'

const loading = useLoading()

// 初始化仓库
const usersStore = userStore()
const { t } = useI18n()

// 变量区
const router = useRouter()
const route = useRoute()

// 理财币种
const selectCoinOption = ref(0)
// 理财币种下拉数据
const coinOptions = ref([
	{
		text: 'USDC',
		value: 0,
		image: getImageUrl('market/USDC.png'),
	},
	{
		text: 'USDT',
		value: 1,
		image: getImageUrl('market/USDT.png'),
	},
])
// 理财币种详情
const selectedCoinItem = computed(() => {
	return coinOptions.value.find((option) => option.value === selectCoinOption.value)
})

// 输入框参数
const stakeAmount = ref(0)
const error = ref(null)
// scroll
const infoList = ref([
	{
		icon: getImageUrl('home/info1.svg'),
		content: t('可靠的安全保障'),
	},
	{
		icon: getImageUrl('home/info2.svg'),
		content: t('稳定可靠的投资回报'),
	},
	{
		icon: getImageUrl('home/info3.svg'),
		content: t('方便易操作'),
	},
])

// 代码区

// 路由跳转
const handleRouter = () => {
	usersStore.SET_PATH_DATA('no')
	router.push('/earn')
}

// 弹窗
const centerDialogVisible = ref(false)
const showPopupFunc = () => {
	if (!stakeAmount.value) {
		showToast({ message: t('请输入质押金额'), icon: 'info' })
		return
	}
	if (!parseFloat(stakeAmount.value)) {
		showToast({ message: t('请输入有效的质押金额'), icon: 'info' })
		return
	}
	centerDialogVisible.value = true
}

const addNew = async () => {
	try {
		const data = {
			configId: currentFormatterDayInfo.value.configId,
			productId: financialStakeList.value.productId,
			stakeAmount: stakeAmount.value,
			stakeToken: coinOptions.value[selectCoinOption.value].text,
		}

		loading.loading()
		await addStakeOrder(data)
		loading.clearLoading()
		stakeAmount.value = 0
		centerDialogVisible.value = false

		showToast({
			message: t('购买理财成功'),
			icon: 'info',
			onClose: () => {
				getEarnInterestAccountInfo(true)
			},
		})
	} catch (err) {
		console.log(err)
	}
}

const selectedDay = ref(0)
// 日期下拉数据
const financialStakeList = ref({
	productId: undefined,
	stakeConfigs: [],
})

const formattedDaysList = computed(() => {
	return financialStakeList.value.stakeConfigs.map((item, index) => ({
		...item,
		leftText: `${item.day} ${t('天')}`,
		rightText: `${dividedForValueDecimal(item.rateMin, 10)}-${dividedForValueDecimal(item.rateMax, 10)}%`,
		amountRange: `${item.minAmount}-${item.maxAmount}`,
		value: index,
	}))
})
// 当前选择的质押配置
const currentFormatterDayInfo = computed(() => {
	return formattedDaysList.value[selectedDay.value]
})

// Function to fetch data
const loadFixPressure = async () => {
	try {
		loading.loading()
		const res = await fetchFinancialStakeListApi()
		loading.clearLoading()

		financialStakeList.value = res.data || {
			productId: undefined,
			stakeConfigs: [],
		}
	} catch (err) {
		console.log(err)
	}
}

const earnInterestAccountInfo = ref({
	platformToken: '',
	stakingAmount: 0, // 质押金额
	stakingDayIncome: 0, // 今日盈利
	stakingTotalIncome: 0, // 总盈利
})
const getEarnInterestAccountInfo = async (showLoading) => {
	try {
		showLoading && loading.loading()
		const res = await fetchFinancialStakeIncomeApi()
		showLoading && loading.clearLoading()
		earnInterestAccountInfo.value = res.data
	} catch (err) {
		console.log(err)
	}
}

const { runLoopTimer } = useLoopFetchApi({
	fetchApi: getEarnInterestAccountInfo,
})

onMounted(() => {
	loadFixPressure()
	getEarnInterestAccountInfo(true)
	runLoopTimer()
})

// 将组件中的数据进行暴露出去
defineExpose({})
</script>

<style lang="scss" scoped>
.confirm1-btn{
	border-radius: 14px;
	border: 1px solid  #FFF;
	background: linear-gradient(180deg, #5CE7FF 0%, #27727F 77.5%, #50CDCD 100%);
	box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.25);
}
.earn_onterset_container {
	background-image: url("../../assets/images/background/sbg_2.png");
	background-position:  top;
	background-size: 100% 100%;
	//width: 90%;
	padding: 48px;
	position: relative;
	//left: 35px;
	//margin-top: 30px;

	.header {
		display: flex;
		justify-content: space-between;

		.left {
			.time {
				font-size: 24px;
				font-weight: 700;
				color: #00DCFF;
			}

			.title {
				font-size: 40px;
				color: #E9E9E9;
				font-weight: 700;
				margin-top: 0px;
				position: relative;
				//height: 28px;
				line-height: 68px;
				//padding-left: 10px;
				// margin-bottom: 18px;

				// &::after {
				// 	position: absolute;
				// 	content: '';
				// 	width: 4px;
				// 	height: 28px;
				// 	left: 0;
				// 	top: 0;
				// 	background: #7BA9FF;
				// }
			}
		}

		.right {
			display: flex;
			justify-content: space-between;

			span {
				font-weight: 700;
				font-size: 28px;
				margin-top: 20px;
				color: #000;
			}

			.img {
				width: 88px;
				height: 88px;
				margin-left: 10px;

				img {
					width: 100%;
					height: 100%;
					vertical-align: super;
				}
			}
		}
	}

	.account {
		width: 100%;
		height: 400px;
		box-sizing: border-box;
		background: url('../../assets/images/home/card_all.png') no-repeat;
		background-size: 100%;
		color: #FBFBFB;
		position: relative;
		margin-top: 30px;
		padding: 48px;

		.title {
			font-weight: 600;
			font-size: 28px;
		}

		.money {
			font-size: 50px;
			font-weight: bold;
			margin-top: 30px;
			margin-bottom: 30px;
			font-weight: bold;
		}

		.introduce {
			display: flex;
			align-items: center;
			font-size: 24px;
			font-weight: bold;

			.trend {
				width: 35px;
				height: 35px;
				margin-right: 10px;

				img {
					width: 100%;
					height: 100%;
					vertical-align: middle;
				}
			}

			.trends {
				margin-left: 3px;
				margin-right: 3px;
				color: #FBFBFB;
				font-weight: 700;
			}
			.day{
				color: #FBFBFB;
				font-weight: 700;
			}
		}
	}

	.range {
		position: relative;
		//height: 1.6rem;
		display: flex;
		align-items: center;

		border: 1px solid #CAB37D;
		background: linear-gradient(99deg, #90C9C6 14.79%, #2194AA 76.69%);
		box-shadow: 4px 4px 17px 0px rgba(1, 3, 246, 0.12);

		border-radius: 0.33333rem;
		padding: 25px;
		margin-top: 30px;
		//margin: 95px 80px 0px;
		z-index: 100;

		.icon {
			width: 40px;
			margin-right: 30px;

			img {
				width: 100%;
			}
		}

		.right_font {
			padding-left: 30px;
			color: var(--vt-header-black);
			flex: 1;
			position: relative;
			margin-right: 30px;

			//   &:before{
			//     content: '';
			//     position: absolute;
			//     top: -30px;
			//     bottom: -30px;
			//     width: 1px;
			//     background-color: #E2E2E2;
			//     left: 0;
			//   }

			.question {
				font-weight: 600;
				font-size: 24px;
				color: #000;
				line-height: normal;
			}

			.info {
				color: #E0E0E0;
				background: transparent;
				backdrop-filter: none;
				font-weight: 400;
				font-size: 20px;
				padding: 0;
				margin-top: 12px;
			}
		}

		.next {
			position: absolute;
			right: 10px;
			top: 50%;
			transform: translateY(-50%);
			display: inline-flex;
			width: 70px;
			height: 70px;

			img {
				width: 100%;
				height: 100%;
			}
		}
	}
}

.scroll_title {
	font-size: 32px;
	font-weight: 700;
	color: #E9E9E9;
	margin-top: 100px;
	position: relative;
	line-height: 28px;
	//padding-left: 10px;
	margin-bottom: 20px;

	// &::after {
	// 	position: absolute;
	// 	content: '';
	// 	width: 4px;
	// 	height: 28px;
	// 	left: 0;
	// 	top: 0;
	// 	background: #7BA9FF;
	// }
}

.info {
			padding: 24px 8px 36px;
			display: flex;
			justify-content: space-between;

			:deep(.van-swipe-item) {
				padding-right: 20px;
				box-sizing: border-box;
			}
			.info_box {
				width: 220px !important;
				height: 234px !important;
				display: flex;
				justify-content: center;
				flex-direction: column;
				border-radius: 18px;
				border: 1px solid  #CAB37D;
				background: linear-gradient(99deg, #90C9C6 14.79%, #2194AA 76.69%);
				box-shadow: 3px 6px 4px 0px rgba(0, 0, 0, 0.25);

				padding: 15px;
				height: 99%;

				.icon {
					line-height: 1;

					img {
						width: 50px;
						height: 50px;
					}
				}

				.content {
					margin-top: 12px;
					font-weight: 500;
					font-size: 28px;
					line-height: 35px;
					text-align: left;
					color: #C7F7FF;
				}
			}
		}

.footer {
	border: 1px solid #CAB37D;
	background: linear-gradient(99deg, #90C9C6 14.79%, #2194AA 76.69%);
	border-radius: 42px;
	padding: 10px 50px 30px;

	.title {
		font-size: 23px;
		color: #226764;
		font-weight: 600;
		margin-top: 20px;
		margin-bottom: 16px;
	}

	.select {
		margin-bottom: 30px;
		text-align: center;

		:deep(.van-dropdown-menu__bar) {
			border-radius: 10px;
		}

		:deep(.van-dropdown-menu__title) :after {
			right: -70px;
			border-color: transparent transparent #000000 #000000;
		}

		:deep(.van-dropdown-item) {
			margin: auto;
			width: 80%;
		}

		:deep(.el-icon) {
			width: 35px;
			height: 35px;
			color: #fff;
		}

		:deep(.el-icon svg) {
			width: 40px;
			height: 40px;
			color: #fff;
		}
	}

	.input {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;

		.select {
			display: flex;
			flex: 1;
			height: 110px;
			margin-bottom: 0;
			margin-right: 40px;
			//margin-left: 40px;
			border-radius: 16px;
			background: #f8f9fb;

			:deep(.el-select) {
				height: 100%;
				width: 100%;
				border-radius: 16px;

				.el-select__wrapper {
					width: 100%;
					padding-top: 0;
					padding-bottom: 0;
					height: 100%;
					font-size: 24px;
				}
			}

			:deep(.van-dropdown-item) {
				margin-left: 30px;
				width: 35%;
			}

			:deep(.van-dropdown-menu__bar) {
				background: #f7f7f7;
			}

			:deep(.van-dropdown-menu__title:after) {
				right: -25px;
				border-color: transparent transparent #000000 #000000;
			}
		}

		.fied {
			border-radius: 16px;
			flex: 1;
			height: 110px;
			display: inline-flex;
			.van-cell-group{
				background: transparent;
				box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
			}

			:deep(.van-field__control) {
				border: 1px solid #fff;
				border-radius: 10px;
				//height: 58px;
				width: 100%;
				padding: 10px;
				font-size: 16px;
				&::placeholder{
					color: #E9E9E9;
				}
			}

			:deep(.van-field, .van-field__body, .van-field__control) {
				height: 100%;
			}

			:deep(.van-field__control) {
				border-width: 0;
				color:#E9E9E9 ;
				font-weight: 500;
			}

			:deep(.van-cell) {
				padding: 0px;
				display: flex;
				align-items: center;
				background: #134D57;
			}

			:deep(.van-cell-group--inset) {
				margin: 0px;
			}
		}
	}

	.rate {
		font-size: 27px;
		padding-top: 48px;
		font-weight: 600;
		color: #4E4E4E;

		.yield,
		.limit {
			position: relative;
			display: flex;
			justify-content: space-between;
			// background: #F8F9FB;
			height: 80px;
			padding: 20px 6px;
			// border-bottom: 0.1px dashed rgb(206, 241, 241);
			width: 98%;
		}
		.yield{
			&::after {
				content: "";
				position: absolute;
				bottom:-8px;
				left:0;
				height: 20px;
				width: 100%;
				background-image: url('@/assets/images/background/border.png');
				background-repeat: no-repeat;
				background-size: 100% 14px;
				background-position: center bottom;
			}
		}

		.limit {
			margin-top: 25px;
		}

		.title {
			color: #0C0C0C;
			margin-top: 0;
			margin-bottom: 0;
			font-weight: 600;
		}
	}

	.subscribe {
		margin-top: 30px;
		.van-button{
			border-radius: 14px;
			border: 1px solid  #FFF;
			background: linear-gradient(180deg, #5CE7FF 0%, #27727F 77.5%, #50CDCD 100%);
			box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.25);
		}
	}
}

.divider {
	position: absolute;
	left: 0px;
	top: 0px;
	width: 1px;
	height: 75px;
	background: #226764;
}

.order_status {
	text-align: center;
	color: #E9E9E9;
	font-size: 40px;
	font-weight: 700;
}

.order_info {
	text-align: center;
	color: #00DCFF;
	font-weight: 500;
	margin-top: 10px;
	margin-bottom: 25px;
}

:deep(.earn-order.el-dialog) {
	border-radius: 20px;
	padding: 66px 48px;
	background-image: url("../../assets/images/background/sbg_2.png");
	background-position:  top;
	background-size: 100% 300%;

	.dialog-title {
		text-align: center;
		font-weight: 600;
		color: var(--vt-header-black);
		.popup-image {
			width: 76px;
			height: 76px;
		}
	}

	.content {
		padding-top: 56px;
		padding-bottom: 56px;

		.each-row {
			display: flex;
			justify-content: space-between;
			margin-bottom: 0.16rem;
			font-weight: 500;
			color: #90C9C6;

			.right-text {
				font-weight: 500;
				color: #E9E9E9;
			}
		}
	}
}
</style>

<style scoped>
.custom-option {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.option-image {
	width: 50px;
	height: 50px;
	margin: 0px;
}

.option-text {
	/* Add additional text styles here if needed */
}
</style>
<style lang="scss">
.footer {
	.el-select {
		.el-select__wrapper {
			border: none;
			font-weight: 500;
			border-radius: 10px;
			/* Optional: rounded corners */
			height: 110px;
			width: 100%;
			font-size: 27px;

			background: #134D57;
			box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
			// padding: 10px 32px;
			text-align: center;
				.el-select__placeholder{
				color:#fff;
				font-weight: 500;
				}
				.el-select__suffix{
					background: #124D57;
					box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.30), -2px -2px 8px rgba(198, 166, 166, 0.25);
					padding: 7px;
					border-radius: 100%;
				}
		}
	}
}
</style>

<style>
.custom-select-container {
	width: 100%;
}

.custom-select-popper {
	&.pledge-days .el-select-dropdown__item {
		justify-content: space-between;
	}

	&.pledge-currency .el-select-dropdown__item {
		img {
			margin-right: 20px;
		}
	}
}

.custom-option {
	display: flex;
	justify-content: space-between;
	padding: 8px 16px;
	box-sizing: border-box;
}

.left-content {
	text-align: left;
}

.right-content {
	text-align: right;
	/* Add any additional styling here */
}

.selected-value {
	display: flex;
	justify-content: space-between;
	box-sizing: border-box;
}
</style>
