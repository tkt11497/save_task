<template>
	<div class="score-page custom-page full-page">
		<van-nav-bar :fixed="true" :title="t('信用评分')" @click-left="onClickLeft">
			<template #left>
				<van-icon :name="arrow" size="18" />
			</template>
		</van-nav-bar>
		<div class="content">
			<div class="circle-wrap">
				<van-circle v-model:current-rate="currentRate" :rate="creditScore" :speed="100" layer-color="#D9D9D9" :color="circleColor" :stroke-width="80">
					<div class="text">
						<span>{{ t('信用评分') }}</span>
						<span class="num">{{ creditScore }}</span>
					</div>
				</van-circle>
			</div>

			<div class="details-wrap">
				<div class="time">{{ t('信用评估时间', { time: formatDate(Date.now(), 'YYYY MM DD') }) }}</div>
				<loan-treaty v-if="isLoaded" form="template" :user-data="userData" :loan-data="loanData" />
			</div>
		</div>
	</div>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue'
import { userStore } from '@/store'
import arrow from '@/assets/images/market/back.svg'
import { useI18n } from 'vue-i18n'
import LoanTreaty from '@/views/user/loan/loan-treaty.vue'
import useLoading from '@/hooks/useLoading.js'
import { formatDate } from '@/utils/index.js'
import { fetchUserKycApi } from '@/apis/user.js'

const usersStore = userStore()
const { t } = useI18n()
const loading = useLoading()

//
const circleColor = computed(() => {
	if (creditScore.value) {
		return '#82A9F9'
	} else {
		return '#D9D9D9'
	}
})

const currentRate = ref(0)
const creditScore = ref(0)
const onClickLeft = () => {
	history.back()
	usersStore.SET_PATH_DATA('yes')
}

const isLoaded = ref(false)
const userData = ref({
	firstName: '#n1',
	lastName: '#n2',
	detailAddress: '#a2',
	phone: '#a4',
})
const loanData = ref({
	lenderName: 'XXXX', // 贷方名称 #a5
	loanDate: '#a1', // 贷款日期
	loanAmount: '#a6', // 贷款金额
	repaymentAmount: '#a7', // 还款金额
	loanDayRatio: '#a8', // 贷款天数比率
	loanDays: '#a9', // 贷款金额
	interest: '#b1', // 利息
	latePaymentFee: '#b2', // 滞纳金
	signImg: '#b3', // 签名图片地址
})
async function getLoadInfo() {
	try {
		loading.loading()
		const res = await fetchUserKycApi()
		loading.clearLoading()
		if (res.data) {
			const responseData = res.data
			creditScore.value = responseData.creditScore || 0
			// userData.value = {
			//   firstName: responseData.firstName,
			//   lastName: responseData.lastName,
			//   detailAddress: responseData.detailAddress,
			//   phone: responseData.phone
			// }
			// loanData.value = {
			//   lenderName: 'XXXX', // 贷方名称
			//   loanDate: '#a1', // 贷款日期
			//   loanAmount:  '#a6', // 贷款金额
			//   repaymentAmount: '#a7', // 还款金额
			//   loanDayRatio: '#a8',  // 贷款天数比率
			//   loanDays: '#a9', // 贷款金额
			//   interest: '#b1', // 利息
			//   latePaymentFee: '#b2', // 滞纳金
			//   signImg: '#b3' // 签名图片地址
			// }
		}
		isLoaded.value = true
	} catch (e) {
		console.log(e)
	}
}

getLoadInfo()
onMounted(() => {
	usersStore.SET_PATH_DATA('no')
})
</script>
<style lang="scss" scoped>
.score-page {
	//height: 100%;

	.content {
		.circle-wrap {
			text-align: center;
		}
		.van-circle {
			width: 223px;
			height: 223px;
			margin: 20px auto 0;

			.text {
				height: 100%;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				color: #000;

				font-size: 13px;
				font-weight: 500;
				line-height: normal;

				.num {
					margin-top: 9px;
					font-size: 43px;
					font-weight: 700;
					line-height: normal;
				}
			}
		}

		.details-wrap {
			padding: 84px 10px 50px 60px;
			white-space: pre-wrap;

			.time {
				color: #999;
				font-size: 28px;
				font-style: normal;
				font-weight: 500;
				//font-weight: bold;
				line-height: 38px;
				letter-spacing: -1.7px;
				text-align: center;
				margin-bottom: 12px;
			}
		}
	}
}
</style>
