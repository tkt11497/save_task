<template>
	<div class="poof_stake_container">
		<!-- Proof of Stake -->
		<div class="header">
			<div class="left">
				<div class="time">{{ t('过去24小时') }}</div>
				<div class="title">{{ t('权益证明') }}</div>
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
			<div class="title">{{ t('权益证明 账户') }}</div>
			<div class="money">
				{{ plusDecimal(poofStakeAccountInfo.stakingAmount || '0') }}
				<span>{{ poofStakeAccountInfo.platformToken || stakeToken }}</span>
			</div>
			<!-- ETH Today's Profit-->
			<div class="introduce">
				<div class="trend">
					<img src="../../assets/images/home/trends.png" alt="trends" />
				</div>
				<span class="trends">{{ plusDecimal(poofStakeAccountInfo.stakingDayIncome || '0') }} </span>
				<span class="trends"> {{ poofStakeAccountInfo.platformToken || stakeToken }} </span>
				<span class="day"> {{ t('今日盈利') }}</span>
			</div>
			<!-- Center Card -->
			<div class="range">
				<div class="icon">
					<!-- <img src="../../assets/images/earn/range_icon.png" alt="range_icon" /> -->
					<img src="../../assets/images/earn/earnIntersetTrading.svg" alt="range_icon" />
				</div>
				<div class="right_font" @click="handleRouter">
					<div class="divider"></div>
					<div class="question">{{ t('什么是权益证明？') }}</div>
					<div class="info">{{ t('了解权益证明的运作方式') }}</div>
				</div>
				<div class="next" @click="handleRouter">
					<img src="../../assets/images/earn/next.png" alt="next" />
				</div>
			</div>
		</div>
		<div class="scroll_title">
			{{ t('质押') }}<span>{{ stakeToken }}</span>
		</div>
		<div class="footer">
			<!-- Button -->
			<div class="buttons">
				<div class="btn">
					<div :class="['pledge', selectedPledge === '0' ? 'selectPledge' : 'unselectePledge']" @click="pledgeFunc('0')">
						{{ t('联合质押') }}
					</div>
					<div :class="['pledge', selectedPledge === '1' ? 'selectPledge' : 'unselectePledge']" @click="pledgeFunc('1')">
						{{ t('个人质押') }}
					</div>
				</div>
				<div v-if="selectedPledge === '0'" class="introduce">{{ t('通过智能合约匹配参与者来实现联合质押，总质押金额达到32') }} ETH.</div>
				<div v-else class="introduce">
					{{ t('独立质押不需要通过智能合约匹配参与者，只要质押金额达到32ETH即可完成个人质押。') }}
				</div>
			</div>
			<!-- Yield -->
			<div class="rate">
				<div class="yield">
					<div class="title">{{ t('收益') }}:</div>
					<div v-if="currentStakeItem" class="title_value">
						<div>{{ dividedForValueDecimal(currentStakeItem.rateMin, 10) }}-{{ dividedForValueDecimal(currentStakeItem.rateMax, 10) }}‰</div>
					</div>
				</div>
			</div>
			<!-- Days Select -->
			<div class="select">
				<van-dropdown-menu :overlay="false">
					<van-dropdown-item :placeholder="t('选择天数')" ref="selectedDayDropdownItemRef">
						<template #title>
							<span v-if="currentStakeItem"> {{ currentStakeItem.day }} {{ t('天') }}</span>
						</template>
						<template #default>
							<div
								v-for="item in massList"
								:key="item.value"
								@click="onConfirmMassDays(item)"
								:class="[
									'van-cell van-cell--clickable van-dropdown-item__option dropdown-text',
									{ 'van-dropdown-item__option--active': item.value === selectedDay },
								]"
							>
								<div class="van-cell__title left-align">{{ item.day }} {{ t('天') }}</div>
								<!-- <br /> -->
								<div class="van-cell__value right-align">
									{{ dividedForValueDecimal(item.rateMin, 10) }}-{{ dividedForValueDecimal(item.rateMax, 10) }}‰
								</div>
							</div>
						</template>
					</van-dropdown-item>
				</van-dropdown-menu>
			</div>
			<div class="stepper">
				<van-cell-group inset>
					<van-field v-model="stakeAmount" :disabled="selectedPledge === '1'" type="number" center :clearable="false" label="" placeholder="">
						<template #left-icon>
							<img src="@/assets/images/poofStake/minus.svg" @click="minusStepper" alt="minus" />
						</template>
						<template #right-icon>
							<img src="@/assets/images/poofStake/plus.svg" @click="plusStepper" alt="plus" />
						</template>
					</van-field>
				</van-cell-group>
			</div>
			<!-- Stake Button -->
			<div class="stake">
				<van-button block round type="primary" @click="showPopupFunc">{{ t('质押') }}</van-button>
			</div>
			<div>
				<el-dialog v-model="centerDialogVisible" width="calc(100vw - 30px)" align-center class="popup-css poofstake-order" z-index="2000">
					<template #header>
						<div class="dialog-title">
							<img src="@/assets/images/poofStake/icon.png" alt="Custom Title" class="popup-image" />
						</div>
					</template>
					<div class="order_status">{{ t('订单状态') }}</div>
					<div class="order_info">{{ t('这是您的订单信息') }}</div>
					<div class="content">
						<div class="each-row">
							<p class="left-text">{{ t('数量') }}:</p>
							<p class="right-text">{{ stakeAmount }} ETH</p>
						</div>
						<div class="each-row">
							<p class="left-text">{{ t('收益') }}:</p>
							<div class="right-text" v-if="currentStakeItem">
								<div>{{ dividedForValueDecimal(currentStakeItem.rateMin, 10) }}-{{ dividedForValueDecimal(currentStakeItem.rateMax, 10) }}‰</div>
							</div>
						</div>
						<div class="each-row">
							<p class="left-text">{{ t('质押期限') }}:</p>
							<p class="right-text" v-if="currentStakeItem">{{ currentStakeItem.day }} {{ t('天') }}</p>
						</div>
					</div>
					<template #footer>
						<div class="dialog-footer">
							<van-button block type="primary" round @click="updateData()" class="confirm1-btn">{{ t('确认') }}</van-button>
						</div>
					</template>
				</el-dialog>
			</div>
		</div>
	</div>
</template>

<script setup name="PoofStake">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { userStore } from '@/store'
import { showToast } from 'vant'
import { useI18n } from 'vue-i18n'
import useLoading from '@/hooks/useLoading.js'
import { dividedForValueDecimal, minusForValueDecimal, plusDecimal, plusForValueDecimal } from '@/utils'
import { addStakeOrder, fetchJointStakeListApi, fetchPersonalStakeListApi } from '@/apis/stake.js'
import { fetchStakeIncomeApi } from '@/apis/wallet.js'
import { useLoopFetchApi } from '@/hooks/useLoopApi.js'

// 初始化仓库
const usersStore = userStore()
const { t } = useI18n()
const loading = useLoading()
// 变量区
const router = useRouter()
const route = useRoute()

const error = ref(null)
const selectedPledge = ref('0')
const centerDialogVisible = ref(false)
// 日期下拉参数
const selectedDay = ref(0)

// 联合质押递增 1，个人质押递增 32
const currentBase = computed(() => {
	if (selectedPledge.value === '0') {
		return 1
	} else {
		return 32
	}
})

const BASE = {
	personal: 32, // 个人质押基数
	joint: 1, // 联合质押基数
}
// 计数器
const stakeAmount = ref(0)
watch(
	() => selectedPledge.value,
	(val) => {
		selectedDay.value = 0
		stakeAmount.value = val === '1' ? BASE.personal : 0
	},
	{
		immediate: true,
	}
)

const showPopupFunc = () => {
	if (!stakeAmount.value) {
		showToast({ message: t('请输入质押数量'), icon: 'info' })
		return
	}
	if (!parseInt(stakeAmount.value)) {
		showToast({ message: t('请输入有效的质押数量'), icon: 'info' })
		return
	}
	centerDialogVisible.value = true
}

const updateData = async () => {
	insertPledge()
}

const insertPledge = async () => {
	try {
		const isJoint = selectedPledge.value === '0'
		const stakeInfo = isJoint ? jointStakeList.value : personalStakeList.value
		let data = {
			configId: currentStakeItem.value.configId,
			productId: stakeInfo.productId,
			stakeAmount: stakeAmount.value,
			stakeToken: stakeToken.value,
		}

		loading.loading()
		await addStakeOrder(data)
		loading.clearLoading()

		stakeAmount.value = currentBase.value
		centerDialogVisible.value = false

		showToast({
			message: t('质押成功'),
			icon: 'info',
			onClose: () => {
				getPoofStakeAccountInfo(true)
			},
		})
	} catch (err) {
		console.log(err)
	} finally {
	}
}

// 质押币种，固定ETH
const stakeToken = ref('ETH')
// 当前选中的质押config列表
const massList = computed(() => {
	const isJoint = selectedPledge.value === '0'
	const stakeList = isJoint ? jointStakeList.value.stakeConfigs : personalStakeList.value.stakeConfigs
	return stakeList.map((item, index) => ({
		...item,
		value: index,
	}))
})
// 当前选中的质押config
const currentStakeItem = computed(() => {
	return massList.value[selectedDay.value]
})
// 获取质押配置信息
// 个人质押配置信息
const personalStakeList = ref({
	stakeConfigs: [],
})
// 联合质押配置信息
const jointStakeList = ref({
	stakeConfigs: [],
})

const getStakeConfig = async () => {
	try {
		loading.loading()
		const [personalRes, jointRes] = await Promise.all([fetchPersonalStakeListApi(), fetchJointStakeListApi()])
		loading.clearLoading()
		personalStakeList.value = personalRes.data || {
			stakeConfigs: [],
		}
		jointStakeList.value = jointRes.data || {
			stakeConfigs: [],
		}
	} catch (err) {
		console.log(err)
	}
}

// 配置天数选择
const selectedDayDropdownItemRef = ref(null)
function onConfirmMassDays(item) {
	selectedDayDropdownItemRef.value?.toggle()
	selectedDay.value = item.value
}
function minusStepper() {
	if (parseFloat(stakeAmount.value) > currentBase.value) {
		stakeAmount.value = minusForValueDecimal(stakeAmount.value, currentBase.value)
	} else {
		if (selectedPledge.value === '1') {
			stakeAmount.value = currentBase.value
		} else {
			stakeAmount.value = 0
		}
	}
}
function plusStepper() {
	if (parseFloat(stakeAmount.value)) {
		stakeAmount.value = plusForValueDecimal(stakeAmount.value, currentBase.value)
	} else {
		stakeAmount.value = currentBase.value
	}
}
// 代码区

// 路由跳转
const handleRouter = () => {
	usersStore.SET_PATH_DATA('no')
	router.push('/stake')
}

const pledgeFunc = (val) => {
	selectedPledge.value = val
}

const poofStakeAccountInfo = ref({
	platformToken: 'ETH',
	stakingAmount: 0, // 质押金额
	stakingDayIncome: 0, // 今日盈利
	stakingTotalIncome: 0, // 总盈利
})
const getPoofStakeAccountInfo = async (isLoading) => {
	try {
		isLoading && loading.loading()
		const res = await fetchStakeIncomeApi()
		isLoading && loading.clearLoading()
		poofStakeAccountInfo.value = res.data || {}
	} catch (err) {
		console.log(err)
	}
}

const { runLoopTimer } = useLoopFetchApi({
	fetchApi: getPoofStakeAccountInfo,
})

onMounted(() => {
	getStakeConfig()
	getPoofStakeAccountInfo(true)
	runLoopTimer()
})

// 将组件中的数据进行暴露出去
defineExpose({})
</script>

<style lang="scss" scoped>
.poof_stake_container {
	padding: 48px;
	position: relative;

	.header {
		display: flex;
		justify-content: space-between;

		.left {
			.time {
				font-size: 24px;
				color: #aaa5a5;
			}

			.title {
				font-size: 40px;
				color: #000;
				font-weight: bold;
				margin-top: 30px;
				position: relative;
				line-height: 68px;
			}
		}

		.right {
			display: flex;
			justify-content: space-between;

			span {
				font-weight: 700;
				font-size: 28px;
				margin-top: 20px;
				color: #7ba9ff;
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
		height: 440px;
		background: url('../../assets/images/earn/earnAccount.png') no-repeat;
		background-size: 100%;
		color: #fff;
		position: relative;
		margin-top: 30px;
		padding: 48px;

		.title {
			font-weight: 500;
			font-size: 28px;
		}

		.money {
			font-size: 50px;
			font-weight: bold;
			margin-top: 30px;
			margin-bottom: 30px;
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
			}
		}

		.range {
			position: relative;
			display: flex;
			align-items: center;
			background: #fff;
			border-radius: 0.33333rem;
			padding: 25px;
			z-index: 100;
			margin-top: 30px;

			.icon {
				width: 40px;
				margin-right: 30px;

				img {
					width: 100%;
				}
			}

			.right_font {
				padding-left: 30px;
				color: #000;
				flex: 1;
				position: relative;
				margin-right: 30px;

				.question {
					font-weight: 590;
					font-size: 24px;
					color: #000;
					line-height: normal;
				}

				.info {
					color: #cbcbcb;
					font-size: 20px;
				}
			}

			.next {
				position: absolute;
				right: 40px;
				top: 50%;
				transform: translateY(-50%);
				display: inline-flex;
				width: 30px;
				height: 30px;

				img {
					width: 100%;
					height: 100%;
				}
			}
		}
	}

	.scroll_title {
		font-size: 30px;
		font-weight: 700;
		margin-top: 60px;
		margin-bottom: 28px;
		position: relative;
		height: 28px;
		line-height: 28px;
		padding-left: 10px;
	}

	.footer {
		border-radius: 32px;
		background: #fff;
		padding: 44px;

		.buttons {
			.btn {
				width: 100%;
				display: flex;
				border-radius: 60px;
				// background: #E5EBF6;
				//padding: 12px 16px;
				margin: 0 -10px 48px;

				.pledge {
					flex: 1;
					cursor: pointer;
					padding: 22px 1px;
					min-height: 80px;
					font-size: 26px;
					text-align: center;
					color: #000;
					border-radius: 60px;
					box-shadow: 0 0.02rem #00000008;
					letter-spacing: -0.08px;
					margin: 0 10px;

					&.selectPledge {
						background: #82a9f94d;
						color: #7ba9ff;
					}
				}
			}

			.introduce {
				background: #d8e4fc;
				margin-top: 30px;
				font-size: 20px;
				padding: 20px;
				color: #9b9b9b;
				border-radius: 20px;
				border: 1px dashed #8df;
			}
		}

		.rate {
			font-size: 25px;
			padding-top: 48px;

			.yield {
				display: flex;
				justify-content: space-between;
				margin-bottom: 30px;
			}

			.title {
				color: #999;
			}

			.title_value {
				color: #409eff;
			}
		}

		.select {
			margin-bottom: 48px;

			:deep .van-dropdown-menu__bar {
				border-radius: 10px;
				height: 55px;
			}

			:deep(.van-dropdown-menu__title:after) {
				right: -70px;
				border-color: transparent transparent #000000 #000000;
				width: 10px;
				height: 10px;
				border-bottom: 2px solid black;
				font-size: 40px;
			}

			:deep(.van-dropdown-menu__title) {
				font-size: 13px;
			}

			:deep(.van-cell__title) {
				font-size: 13px;
				text-align: left;
			}

			:deep(.van-dropdown-item) {
				margin: auto;
				width: 75%;

				.van-cell__title,
				.van-cell__value {
					font-size: 13px;
					color: var(--van-cell-text-color);
				}

				.van-dropdown-item__option--active {
					.van-cell__title,
					.van-cell__value {
						color: var(--van-dropdown-menu-option-active-color);
					}
				}
			}
		}

		.stepper {
			margin-bottom: 30px;
			// color: #eaecf0;

			:deep(.van-cell-group.van-cell-group--inset) {
				margin: 0;
				.van-cell {
					background: #f9fafb;
					padding: 0 18px;
					height: 56px;
				}

				.van-field__control {
					text-align: center;
					font-size: 14px;

					&:disabled {
						color: var(--van-field-input-text-color);
						-webkit-text-fill-color: var(--van-field-input-text-color);
					}
				}

				img {
					vertical-align: middle;
				}
			}

			:deep .van-stepper {
				width: 100%;
				height: 55px;
				background: #f9fafc;
				border-radius: 10px;
				display: flex;
				justify-content: space-between;
				align-items: center;
				box-shadow: var(--van-dropdown-menu-shadow);
			}

			:deep .van-stepper__minus,
			:deep .van-stepper__plus {
				background-color: #d1e1ff;
				border-radius: 5px;
				color: black;
				width: 22px;
				height: 22px;
			}

			:deep(.van-stepper__input) {
				font-size: 13px;
			}
		}

		//.stake {
		//	:deep .van-button--normal {
		//		width: 100%;
		//		border-radius: 30px;
		//		height: 55px;
		//		font-size: 17px;
		//		background: #82a8f9;
		//		border: 1px solid #82a8f9;
		//		font-weight: 600;
		//	}
		//}
	}

	.divider {
		position: absolute;
		left: 0px;
		top: 6px;
		width: 1px;
		height: 55px;
		background: rgba(0, 0, 0, 0.15);
	}
}

.order_status {
	text-align: center;
	font-size: 40px;
	font-weight: 700;
}

.order_info {
	text-align: center;
	color: gray;
	margin-top: 10px;
	margin-bottom: 25px;
}
</style>
<style>
.dropdown-text {
	display: flex;
	justify-content: space-between;
	/* Distribute space between the left and right sections */
	width: 100%;
	/* Ensure the div takes up the full width of the dropdown item */
}
</style>
<style scoped lang="scss">
/* Center the title icon in the dialog title */
.dialog-title {
	display: flex;
	justify-content: center;
	align-items: center;
	/* Optionally centers the icon vertically */
	height: 100%;
	/* Ensures the title container has enough height */
}

.custom-message-box .popup-image {
	display: block;
	margin: 0 auto;
	width: 80%;
	/* Adjust width as needed */
}

.custom-message-box .custom-message {
	text-align: center;
	margin: 20px 0;
}

.el-dialog__footer {
	display: flex;
	justify-content: center;
}

.each-row {
	display: flex;
	justify-content: space-between;
	margin-bottom: 12px;
}

.popup-image {
	width: 34px;
	height: 34px;
}

.left-text,
.right-text {
	font-size: 26px;
	font-weight: 500;
	color: #999;
}

.right-text {
	font-weight: 700;
	color: #000;
}

/* Ensure dialog footer content is centered */
.dialog-footer {
	display: flex;
	justify-content: center;
	padding: 10px;
	width: 100%;
}

:deep(.poofstake-order) {
	border-radius: 20px;
	padding: 66px 48px;

	.dialog-title {
		.popup-image {
			width: 76px;
			height: 76px;
		}
	}

	.content {
		border-top: 1px dashed #82a8f9;
		border-bottom: 1px dashed #82a8f9;
		padding-top: 56px;
		padding-bottom: 56px;
	}
}
</style>
