<template>
	<div class="smart-contract" v-if="isShowContract">
		<div class="block1">
			<img class="icon" src="@/assets/images/home/smartcontract.svg" alt="circle" />
			<div class="des">
				<span class="p1">{{ t('智能合约') }}</span>
				<span class="p2">{{ t('解锁智能合约的力量，获取以太坊矿池奖励。') }}</span>
			</div>
		</div>
		<div class="block2">
			<div class="item">
				<span class="label">{{ t('质押数量') }}</span>
				<span class="value">{{ contractData.stakeAmount }} {{ contractData.stakeToken }}</span>
			</div>
			<div class="item">
				<span class="label">{{ t('奖励') }}</span>
				<span class="value">{{ contractData.awardAmount }} {{ contractData.awardToken }}</span>
			</div>
			<div class="item">
				<span class="label">{{ t('质押期限') }}</span>
				<span class="value">{{ contractData.stakeDay }} {{ t('天') }}</span>
			</div>
		</div>
		<van-button plain block round type="primary" @click="btnHandle">
			<template #icon>
				<img class="icon" :width="12" src="@/assets/images/home/icon_eth.png" alt="circle" />
			</template>
			{{ contractData.stakeStatus === 0 ? t('申请激活') : t('领取ETH奖金') }}
		</van-button>
	</div>
</template>
<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { showToast } from 'vant'
import router from '@/router'
import { useI18n } from 'vue-i18n'
import useLoading from '@/hooks/useLoading.js'
import { addFixStakeOrderApi, fetchFixStakeApi } from '@/apis/stake.js'
import { useLoopFetchApi } from '@/hooks/useLoopApi.js'

const { t } = useI18n()
const loading = useLoading()

const isShowContract = ref(false)
// 智能合约
const contractData = ref({
	nodeAmount: '0',
	prizeEth: '0',
	days: '0',
	stakeStatus: '0',
})
const getFixStake = async () => {
	try {
		const res = await fetchFixStakeApi()
		if (res.data) {
			contractData.value = res.data
			isShowContract.value = true
		} else {
			isShowContract.value = false
		}
	} catch (error) {
		console.log(error)
		throw error
	}
}

// 客户端申请激活
const fixactivityClientApply = async () => {
	if (!contractData.value.productId) return
	try {
		loading.loading()
		await addFixStakeOrderApi({
			productId: contractData.value.productId,
		})
		loading.clearLoading()
		showToast({
			message: t('操作成功'),
			icon: 'info',
		})
		getFixStake()
	} catch (error) {
		console.log(error)
	}
}
// 0：未进行，1：进行中，2：已结算，3：已领取
const btnHandle = () => {
	if (!contractData.value.productId) return

	if (contractData.value.stakeStatus === 0) {
		fixactivityClientApply()
	} else {
		router.push('/smartcontract')
	}
}

const { runLoopTimer, stopLoopTimer } = useLoopFetchApi({
	fetchApi: getFixStake,
	loopCall: () => {
		if (isShowContract.value) {
			console.log('====smartContract======已查询到固定质押，停止轮询')
			stopLoopTimer()
		}
	},
	needImmediatelyExecute: true,
	needErrorLoop: false,
})
onMounted(() => {
	runLoopTimer()
})
</script>
<style lang="scss" scoped>
.smart-contract {
	width: calc(100% - 80px);
	margin: 20px auto 94px;
	border-radius: 24px;
	border-top: 1.5px solid #FFF;
	background: linear-gradient(270deg, rgba(153, 153, 153, 0.50) 0%, rgba(255, 255, 255, 0.50) 100%);
	box-shadow: 0px 2px 4.4px 2px rgba(0, 0, 0, 0.15);
	padding: 46px 48px;

	.block1 {
		display: flex;
		margin-bottom: 40px;

		.icon {
			width: 90px;
			height: 90px;
			margin-right: 14px;
		}

		.des {
			.p1 {
				display: block;
				font-size: 36px;
				font-weight: 600;
				line-height: 44px;
				text-align: left;
				color: var(--vt-header-black);
			}

			.p2 {
				display: block;
				font-size: 24px;
				font-weight: 500;
				line-height: 28px;
				letter-spacing: -0.03em;
				text-align: left;
				color: var(--vt-sub-black);
			}
		}
	}

	.block2 {
		margin-bottom: 32px;

		.item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			border: 0.01rem dashed #646464;
			background: linear-gradient(90deg, rgba(217, 229, 251, 0.75) 0%, rgba(116, 165, 255, 0.75) 100%);
			border-radius: 12px;
			padding: 20px 30px 20px 20px;
			margin-bottom: 16px;

			.label {
				font-size: 28px;
				line-height: 28px;
				text-align: left;
				color: var(--vt-sub-black);
			}

			.value {
				font-size: 24px;
				font-weight: 700;
				line-height: 28px;
				text-align: left;
				color: var(--vt-header-black);
			}
		}
	}
	.van-button{
		background: linear-gradient(180deg, rgba(241, 241, 241, 0.80) 0%, rgba(204, 209, 219, 0.80) 78%, rgba(160, 205, 232, 0.80) 100%);
		color: var(--vt-sub-black);
		border: none;
	}
}
</style>
