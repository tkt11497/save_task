<template>
	<div class="main-page custom-page full-page">
		<van-nav-bar :fixed="true" :title="t('节点质押')" @click-left="onClickLeft">
			<template #left>
				<van-icon :name="arrow" size="18" />
			</template>
		</van-nav-bar>
		<div class="content">
			<div class="head">
				<!--				<div class="left">-->
				<!--					<span class="p1">{{ t('节点数量') }}</span>-->
				<!--					<span class="p2 ellipsis-col"-->
				<!--						>{{ contractData.nodeAmount }} <i>{{ contractData.stakeToken }}</i>-->
				<!--					</span>-->
				<!--					<p class="p3">-->
				<!--						<img src="@/assets/images/home/trends.png" alt="trends" />-->
				<!--						{{ contractData.stakeAmount - contractData.nodeAmount || 0 }} {{ t('未达到') }}-->
				<!--					</p>-->
				<!--				</div>-->
				<!--				<div class="right">{{ timesForValueDecimal(reachRate, 100) }}%</div>-->
			</div>
			<div class="node-block">
				<h2 class="title">{{ t('质押信息') }}</h2>
				<div class="list">
					<div class="item">
						<span class="p1">{{ t('同意的金额') }}:</span>
						<span class="p2">{{ contractData.stakeAmount }} {{ contractData.stakeToken }}</span>
					</div>
					<div class="item">
						<span class="p1">{{ t('质押期限') }}:</span>
						<span class="p2">{{ contractData.stakeDay }} {{ t('天') }}</span>
					</div>
					<div class="item">
						<span class="p1">{{ t('收益 / 回报') }}:</span>
						<span class="p2">{{ contractData.stakeRate }}%</span>
					</div>
					<div class="item">
						<span class="p1">{{ t('奖励') }}:</span>
						<span class="p2">{{ contractData.awardAmount }} {{ contractData.awardToken }}</span>
					</div>
					<div class="item">
						<span class="p1">{{ t('总回报') }}:</span>
						<span class="p2">
							{{
								timesForValueDecimal(
									timesForValueDecimal(contractData.stakeAmount, contractData.stakeDay),
									dividedForValueDecimal(contractData.stakeRate, 100)
								)
							}}
							{{ contractData.awardToken }}
						</span>
					</div>
					<div class="item">
						<span class="p1">{{ t('今日回报') }}:</span>
						<span class="p2">
							{{ timesForValueDecimal(timesForValueDecimal(contractData.stakeAmount, 1), dividedForValueDecimal(contractData.stakeRate, 100)) }}
							{{ contractData.awardToken }}
						</span>
					</div>
				</div>
				<div class="tips">
					{{ t('Erc20智能合约矿池即将开启下一次ETH分享活动，现在申请加入，活动开始后流动性提供者最多可分享20ETH奖励') }}
				</div>
				<div class="btns">
					<van-button plain type="primary" @click="btnHandle('add')">{{ t('添加') }}</van-button>
					<van-button plain type="primary" @click="onClickLeft">{{ t('取消') }}</van-button>
				</div>
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
				<van-button class="btn" size="small" type="primary" @click="fixactivityClientAdd">{{ t('确认') }}</van-button>
			</div>
		</van-popup>
	</div>
</template>
<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { userStore, useWeb3Store } from '@/store'
import { dividedForValueDecimal, getImageUrl, timesForValueDecimal } from '@/utils/index.js'
import { showToast } from 'vant'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useToken } from '@/hooks/useToken'
import useLoading from '@/hooks/useLoading.js'
import { addNodeAmountApi, fetchFixStakeApi } from '@/apis/stake.js'

const loading = useLoading()

const { t } = useI18n()
const userStoreData = userStore()
const { currentCurrency, address } = storeToRefs(useWeb3Store())

const { getPlatformTokenByCoinType } = useToken()

onMounted(() => {
	fixactivityClient()
	userStoreData.SET_PATH_DATA('no')
})
const arrow = getImageUrl('user/arrow.png')
const showPop = ref(false)
const showPopType = ref('node')

const amount = ref('')

const opened = () => {
	fixactivityClient()
}
const closed = () => {
	showPopType.value = 'node'
	showPop.value = false
}
const btnHandle = (type) => {
	showPop.value = true
	showPopType.value = type
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

const getPlatformAccount = async () => {
	try {
		const res = await getPlatformTokenByCoinType(contractData.value.stakeToken)
		return res.data.balance || 0
	} catch (e) {
		return 0
	}
}

const toastTimer = ref(null)
const fixactivityClientAdd = async () => {
	const tokenBalance = await getPlatformAccount()
	console.log('fixactivityClientAdd---', amount.value, tokenBalance)

	if (!contractData.value.stateOrderId) {
		return showToast({ message: t('操作失败'), icon: 'info' })
	}
	if (!parseFloat(amount.value)) {
		return showToast({ message: t('金额输入有误，请输入大于0的金额'), icon: 'info' })
	}
	if (amount.value * 1 > tokenBalance * 1) {
		return showToast({ message: t('操作失败，您的代币余额不足'), icon: 'info' })
	}
	try {
		loading.loading()
		await addNodeAmountApi({
			nodeAmount: amount.value,
			stakeOrderId: contractData.value.stateOrderId,
		})
		loading.clearLoading()
		clearTimeout(toastTimer.value)

		showPopType.value = 'node'
		showPop.value = false
		amount.value = ''

		showToast({
			message: t('添加成功'),
			icon: 'info',
			onClose: fixactivityClient,
		})
	} catch (error) {
		console.log(error)
	}
}

const maxBalHandle = async () => {
	try {
		amount.value = await getPlatformAccount()
	} catch (e) {
		console.log(e)
	}
}

// 返回
const onClickLeft = () => {
	history.back()
	userStoreData.SET_PATH_DATA('yes')
}

onUnmounted(() => {
	clearTimeout(toastTimer.value)
})
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

:deep(.contract-pop-layer) {
	background: rgba($color: #000000, $alpha: 0.45);
}
:deep(.van-nav-bar__title) {
	font-size: 20px;
	font-weight: 700;
	color: #000;
}

.node-block {
	padding: 44px 34px;
	border-radius: 26px;
	font-size: 26px;
	background: #fff;
	margin: -400px auto 0;
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

	.btns {
		padding-left: 12px;
		padding-right: 12px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 20px;

		.van-button {
			flex: 1;
			border-radius: 30px;
			border: 1px solid #82a8f9;
			height: 45px;
			width: 102px;
			padding: 16px 6px;
			font-size: 12px;
			font-weight: 600;
			line-height: 12.1px;
			text-align: left;
			color: #82a9f9;

			&:last-child {
				border: 1px solid #82a8f9;
				background: #82a8f9;
				color: #fff;
				margin-left: 20px;
			}
		}
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
					border-radius: 6px;
					background: #82a8f9;
					color: #fff;
					font-size: 12px;
					font-weight: 500;
					border-color: #82a8f9;
				}
			}
		}

		.btn {
			background: #82a8f9;
			border-radius: 52px;
			color: #fff;
			font-size: 32px;
			font-weight: 600;
			width: calc(100% - 28px);
			height: 90px;
			border-color: transparent;
		}
	}
}
</style>
