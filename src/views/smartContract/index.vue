<template>
	<div class="main-page custom-page full-page">
		<van-nav-bar :fixed="true" :title="t('节点质押')" @click-left="onClickLeft">
			<template #left>
				<van-icon :name="arrow" size="18" />
			</template>
		</van-nav-bar>
		<div class="content">
			<div class="head">
				<div class="left">
					<span class="p1">{{ t('节点数量') }}</span>
					<span class="p2 ellipsis-col"
						>{{ stakeOrder.showNodeAmount || 0 }} <i>{{ stakeOrder.stakeToken }}</i>
					</span>
					<p class="p3">
						<img src="@/assets/images/home/trends.png" alt="trends" />
						<span
							>{{ timesForValueDecimal(stakeOrder.nodeInputAmount, dividedForValueDecimal(stakeOrder.stakeRate, 100)) || 0 }}
							{{ stakeOrder.stakeToken }}</span
						>
						<span>&nbsp;&nbsp;&nbsp;{{ t('未达到') }}</span>
					</p>
				</div>
				<div class="right">{{ dividedByDecimal(reachRate, 100, 2) }}%</div>
			</div>
			<div class="node-block">
				<h2 class="title">{{ t('质押信息') }}</h2>
				<div class="list">
					<div class="item">
						<span class="p1">{{ t('同意的金额') }}:</span>
						<span class="p2">{{ stakeOrder.stakeAmount || 0 }} {{ stakeOrder.stakeToken }}</span>
					</div>
					<div class="item">
						<span class="p1">{{ t('质押期限') }}:</span>
						<span class="p2">{{ stakeOrder.stakeDay || 0 }} {{ t('天') }}</span>
					</div>
					<div class="item">
						<span class="p1">{{ t('收益 / 回报') }}:</span>
						<span class="p2">{{ toFixedDecimal(stakeOrder.stakeRate || 0, 2) }}%</span>
					</div>
					<div class="item">
						<span class="p1">{{ t('奖励') }}:</span>
						<span class="p2">{{ stakeOrder.awardAmout || 0 }} {{ stakeOrder.awardToken }}</span>
					</div>
					<div class="item">
						<span class="p1">{{ t('总回报') }}:</span>
						<span class="p2">
							{{
								timesForValueDecimal(
									timesForValueDecimal(stakeOrder.stakeAmount, stakeOrder.stakeDay),
									dividedForValueDecimal(stakeOrder.stakeRate, 100)
								)
							}}
							{{ stakeOrder.stakeToken }}
						</span>
					</div>
					<div class="item">
						<span class="p1">{{ t('今日回报') }}:</span>
						<span class="p2">
							{{ timesForValueDecimal(timesForValueDecimal(stakeOrder.stakeAmount, 1), dividedForValueDecimal(stakeOrder.stakeRate, 100)) }}
							{{ stakeOrder.stakeToken }}
						</span>
					</div>
				</div>
				<div class="tips">
					{{ t('Erc20智能合约矿池即将开启下一次ETH分享活动，现在申请加入，活动开始后流动性提供者最多可分享20ETH奖励') }}
				</div>

				<van-space :size="10" class="item-block">
					<van-button plain round block type="primary" @click="showPop = true">{{ t('添加') }}</van-button>

					<van-button block round type="primary" @click="handleClaimRewards">{{ t('提款') }}</van-button>
				</van-space>
			</div>
		</div>

		<van-popup class="contract-pop" overlay-class="contract-pop-layer" v-model:show="showPop" @opened="opened" @closed="closed"
			><div class="node-add">
				<img class="icon" src="@/assets/images/smart-contract/wallet.png" alt="" />
				<van-divider />
				<span class="label">{{ t('添加金额') }}:</span>
				<van-field v-model.number="amount" type="number" center placeholder="">
					<template #button>
						<span class="coin">{{ contractData.stakeToken }}</span>
						<van-button size="small" type="primary" @click="maxBalHandle">{{ t('最大') }}</van-button>
					</template>
				</van-field>
				<van-divider />
				<van-button block round type="primary" @click="fixactivityClientAdd">{{ t('确认') }}</van-button>
			</div>
		</van-popup>
	</div>
</template>
<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { userStore, useWeb3Store } from '@/store'
import { dividedByDecimal, dividedForValueDecimal, getImageUrl, minusForValueDecimal, timesForValueDecimal, toFixedDecimal } from '@/utils/index.js'
import { showToast } from 'vant'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useToken } from '@/hooks/useToken'
import useLoading from '@/hooks/useLoading.js'
import { addNodeAmountApi, claimRewardsApi, fetchFixStakeApi, fetchFixStakeOrderApi } from '@/apis/stake.js'

const loading = useLoading()

const { t } = useI18n()
const userStoreData = userStore()
const { currentCurrency, address } = storeToRefs(useWeb3Store())

const { getChainBalanceByTokenName } = useToken()

onMounted(() => {
	fixactivityClient().then(() => {
		getStakeOrder()
	})
	userStoreData.SET_PATH_DATA('no')
})
const arrow = getImageUrl('user/arrow.png')
const showPop = ref(false)

const amount = ref('')

const opened = () => {
	fixactivityClient().then(() => {
		getStakeOrder()
	})
}
const closed = () => {
	showPop.value = false
}

// 智能合约数据
const contractData = ref({})
// 获取智能合约
const fixactivityClient = async () => {
	try {
		const res = await fetchFixStakeApi()
		contractData.value = res.data || {}
	} catch (error) {
		console.log(error)
	}
}

const stakeOrder = ref({})
const getStakeOrder = async () => {
	try {
		if (!contractData.value || !contractData.value.stateOrderId) return
		const res = await fetchFixStakeOrderApi(contractData.value.stateOrderId)
		stakeOrder.value = res.data
	} catch (e) {
		console.log(e)
	}
}

// 领取奖励
const handleClaimRewards = async () => {
	if (!contractData.value || !contractData.value.stateOrderId) {
		return
	}
	try {
		loading.loading()
		await claimRewardsApi({
			orderId: contractData.value.stateOrderId,
		})
		loading.clearLoading()

		showToast({
			icon: 'info',
			message: t('操作成功'),
			onClose: getStakeOrder,
		})
	} catch (e) {
		console.log(e)
	}
}

const fixactivityClientAdd = async () => {
	const tokenBalance = await getChainBalanceByTokenName(contractData.value.stakeToken)
	console.log('fixactivityClientAdd---', amount.value, tokenBalance)

	if (!contractData.value.stateOrderId) {
		return showToast({ message: t('操作失败'), icon: 'info' })
	}
	if (!parseFloat(amount.value)) {
		return showToast({ message: t('金额输入有误，请输入大于0的金额'), icon: 'info' })
	}
	// 校验用户链上余额
	// else if (compareNumber(tokenBalance, amount.value) === -1) {
	// 	return showToast({ message: t('操作失败，您的代币余额不足'), icon: 'info' })
	// }
	try {
		loading.loading()
		await addNodeAmountApi({
			nodeAmount: amount.value,
			stakeOrderId: contractData.value.stateOrderId,
		})
		loading.clearLoading()

		showPop.value = false
		amount.value = ''

		showToast({
			message: t('添加成功'),
			icon: 'info',
			onClose: getStakeOrder,
		})
	} catch (error) {
		console.log(error)
	}
}

const reachRate = computed(() => {
	if (stakeOrder.value.stakeOrderId) {
		return dividedForValueDecimal(stakeOrder.value.nodeInputAmount, stakeOrder.value.showNodeAmount)
	} else {
		return 0
	}
})

const maxBalHandle = async () => {
	try {
		// 获取链上余额
		amount.value = await getChainBalanceByTokenName(contractData.value.stakeToken)
	} catch (e) {
		console.log(e)
	}
}

// 返回
const onClickLeft = () => {
	history.back()
	userStoreData.SET_PATH_DATA('yes')
}

onUnmounted(() => {})
</script>
<style lang="scss" scoped>
.main-page {
	position: relative;
	background: #f5f8ff;

	.content {
		.head {
			width: 100%;
			height: 500px;
			display: flex;
			justify-content: space-between;
			background: #82a9f9 url(@/assets/images/smart-contract/bg.png) no-repeat -100px 100px;
			background-size: 100% 100%;

			.left {
				display: flex;
				flex-direction: column;
				margin-left: 50px;
				margin-top: 80px;
				overflow: hidden;

				.p1 {
					font-size: 28px;
					font-weight: 400;
					line-height: 24px;
					letter-spacing: -0.09em;
					text-align: left;
					color: #fff;
				}

				.p2 {
					width: 100%;
					height: 70px;
					margin-top: 20px;
					margin-bottom: 36px;
					font-size: 60px;
					font-weight: 600;
					text-align: left;
					color: #fbfbfb;
					line-height: 1;

					i {
						font-weight: 600;
						font-style: normal;
						font-size: 46px;
					}
				}

				.p3 {
					display: flex;
					align-items: center;
					font-size: 24px;
					font-weight: 800;
					line-height: 20px;
					text-align: left;
					color: #fefefe;

					img {
						width: 24px;
						height: 24px;
						margin-right: 4px;
					}
				}
			}

			.right {
				height: fit-content;
				min-width: 102px;
				background: #a6befa;
				border-radius: 30px;
				padding: 10px 16px;
				font-size: 28px;
				font-weight: 700;
				text-align: center;
				color: #fff;
				margin-right: 50px;
				margin-top: 140px;
			}
		}
	}
}

.node-block {
	padding: 44px 34px;
	border-radius: 26px;
	font-size: 26px;
	background: #fff;
	margin: -200px auto 0;
	width: calc(100% - 120px);

	.title {
		font-size: 28px;
		font-weight: 600;
		line-height: 30px;
		letter-spacing: -0.06em;
		text-align: left;
		color: #131313;
	}

	.list {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 24px;
		margin-top: 40px;
		margin-bottom: 34px;

		.item {
			display: flex;
			flex-direction: column;
			border: 1px solid #b6b6b6;
			padding: 16px 20px;
			border-radius: 30px;

			.p1 {
				font-size: 20px;
				font-weight: 590;
				line-height: 28px;
				text-align: center;
				color: #9b9b9b;
				margin-bottom: 12px;
			}

			.p2 {
				font-size: 20px;
				line-height: 24px;
				letter-spacing: -0.06em;
				text-align: center;
				color: #313131;
				font-weight: 500;
			}
		}
	}

	.tips {
		border: 1px dashed #b6b6b6;
		background: #d9e5fd;
		padding: 26px 18px;
		border-radius: 30px;
		font-size: 24px;
		font-weight: 500;
		line-height: 34px;
		letter-spacing: -0.12em;
		text-align: left;
		color: #838282;
		margin-bottom: 40px;
	}
}

:deep(.contract-pop) {
	width: calc(100% - 100px);
	min-height: 400px;
	border-radius: 26px;

	.node-add {
		border-radius: 26px;
		font-size: 26px;
		padding: 54px 14px 60px;
		display: flex;
		flex-direction: column;
		align-items: center;

		.icon {
			width: 68px;
			height: 68px;
			margin-bottom: 100px;
		}

		.van-divider {
			border-style: dashed;
			border-color: #a4a4a4;
			width: 100%;
			margin-bottom: 20px;
		}

		.label {
			margin-left: 22px;
			align-self: flex-start;
			margin-bottom: 24px;
			color: #9b9b9b;
		}

		.van-cell {
			background: #f1f2f3;
			border-radius: 8px;
			padding: 7px 8px 6px 11px;
			margin-bottom: 29px;
			height: 58px;
			width: calc(100% - 20px);

			&::after {
				display: none;
			}

			.van-field__button {
				display: flex;
				align-items: center;

				.coin {
					color: #9b9b9b;
					font-weight: 500;
					font-size: 13px;
					margin-right: 8px;
				}

				.van-button {
					min-width: 40px;
					height: 34px;
				}
			}
		}
	}
}
</style>
