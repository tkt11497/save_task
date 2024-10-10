<template>
	<div class="loan-detail custom-page full-page">
		<van-nav-bar :fixed="true" :title="t('借款')" @click-left="onClickLeft">
			<template #left>
				<van-icon :name="arrow" size="23" />
			</template>
		</van-nav-bar>
		<template v-if="stepPage === 'home'">
			<div class="content">
				<div class="block1">
					<p class="p1">{{ t('贷款详情') }}</p>
					<p class="p2">{{ t('请检查您的贷款详情并确认') }}</p>
				</div>
				<div class="lists">
					<div class="item">
						<span class="label">{{ t('贷款金额') }}:</span>
						<span class="value">{{ loanOrder.loanAmount }} {{ loanOrder.changeProductInfo.walletToken }}</span>
					</div>
					<div class="item">
						<span class="label">{{ t('借款期限') }}</span>
						<span class="value">{{ loanOrder.changeProductInfo.borrowDay }} {{ t('天') }}</span>
					</div>
					<div class="item">
						<span class="label">{{ t('日利率') }}:</span>
						<span class="value">{{ loanOrder.changeProductInfo.dayRate }}%</span>
					</div>
					<div class="item">
						<span class="label">{{ t('总利息金额') }}:</span>
						<span class="value">{{ totalInterest }} {{ loanOrder.changeProductInfo.walletToken }}</span>
					</div>
				</div>
				<div class="tips">
					{{ t('请确认并签字') }} <span>{{ t('贷款协议') }}</span>
				</div>
			</div>
			<van-action-bar>
				<van-button block round type="primary" @click="continueHandle()">{{ t('下一步') }}</van-button>
			</van-action-bar>
		</template>
		<template v-if="stepPage === 'agreement'">
			<div class="content agreement">
				<div class="block1">
					<p class="p1">{{ t('您的贷款协议') }}</p>
					<p class="p2">{{ t('请检查您的贷款详情并确认') }}</p>
				</div>
				<div class="block2" ref="agreementRef">
					<loan-treaty :user-data="userKycRecordData" :loan-data="loanData" />
				</div>
			</div>
			<van-action-bar>
				<van-button block round type="primary" @click="continueHandle()">{{ t('同意') }}</van-button>
			</van-action-bar>
		</template>
		<template v-if="stepPage === 'signature'">
			<div class="content signature">
				<div class="block1">
					<p class="p1">{{ t('写下你的签名') }}</p>
					<p class="p2">{{ t('请提供与身份证相同的真实签名') }}</p>
				</div>
				<div class="block2">
					<vue-esign ref="esign" :height="600" :isCrop="isCrop" :lineWidth="lineWidth" :lineColor="lineColor" v-model:bgColor="bgColor" />
				</div>
				<van-space class="item-block btns" :size="10">
					<van-button block round plain type="primary" @click="handleResetSign">{{ t('重签') }}</van-button>
					<van-button block round type="primary" @click="continueHandle()">{{ t('下一步') }}</van-button>
				</van-space>
			</div>
		</template>
		<template v-if="stepPage === 'confirmation'">
			<div class="content confirmation">
				<div class="block1">
					<p class="p1">{{ t('再确认') }}</p>
					<p class="p2">{{ t('请检查您的贷款详情并确认') }}</p>
				</div>
				<div class="lists">
					<div class="item">
						<span class="label">{{ t('贷款金额') }}:</span>
						<span class="value">{{ loanOrder.loanAmount }} {{ loanOrder.changeProductInfo.walletToken }}</span>
					</div>
					<div class="item">
						<span class="label">{{ t('借款期限') }}</span>
						<span class="value">{{ loanOrder.changeProductInfo.borrowDay }} {{ t('天') }}</span>
					</div>
					<div class="item">
						<span class="label">{{ t('日利率') }}:</span>
						<span class="value">{{ loanOrder.changeProductInfo.dayRate }}%</span>
					</div>
					<div class="item">
						<span class="label">{{ t('总利息金额') }}:</span>
						<span class="value">{{ totalInterest }} {{ loanOrder.changeProductInfo.walletToken }}</span>
					</div>
				</div>

				<van-space :size="10" class="item-block btns">
					<van-button block round plain type="primary" @click="onClickLeft()">{{ t('取消') }}</van-button>
					<van-button block round type="primary" @click="continueHandle()">{{ t('确认') }}</van-button>
				</van-space>
			</div>
		</template>
		<template v-if="stepPage === 'success'">
			<div class="content success">
				<div class="block1">
					<img src="@/assets/images/user/check_circle.svg" alt="" />
					<p class="p1">{{ t('成功完成！') }}</p>
					<p class="p2">{{ t('申请成功，请等待审核') }}</p>
					<van-button class="btns" block round type="primary" @click="continueHandle()">{{ t('前往记录') }}</van-button>
				</div>
			</div>
		</template>
	</div>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue'
import { userStore } from '@/store'
import { storeToRefs } from 'pinia'
import arrow from '@/assets/images/market/back.svg'
import { base64ToBlob, dividedForValueDecimal, formatDate, timesDecimal, timesForValueDecimal } from '@/utils'
import vueEsign from 'vue-esign'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import useLoading from '@/hooks/useLoading.js'
import LoanTreaty from '@/views/user/loan/loan-treaty.vue'
import { fetchUserKycApi } from '@/apis/user.js'
import { createLoanOrderApi } from '@/apis/loan.js'
import { uploadFileApi } from '@/apis/common.js'

const usersStore = userStore()
const { loanOrder } = storeToRefs(usersStore)
const { t } = useI18n()
const router = useRouter()
const loading = useLoading()

const signImgUrl = ref('')
const uploadSignImg = async (base64) => {
	try {
		const [imageBlob, imageType] = base64ToBlob(base64)
		const formData = new FormData()
		formData.append('file', imageBlob, `${Date.now()}.${imageType}`)

		loading.loading()
		const res = await uploadFileApi(formData)
		loading.clearLoading()
		signImgUrl.value = res.data
	} catch (err) {
		console.log(err)
		throw err
	}
}
const addLoadOrder = async () => {
	try {
		!signImgUrl.value && (await uploadSignImg(esignImg.value))

		const { userId, loanProductId, loanAmount, orderCurrency } = loanOrder.value
		const params = {
			borrowAmount: loanAmount * 1,
			productId: loanProductId,
			signatureImageUrl: signImgUrl.value,
		}
		loading.loading()
		await createLoanOrderApi(params)
		loading.clearLoading()
		stepPage.value = 'success'
	} catch (err) {
		// Handle errors
	}
}
const agreementRef = ref(null)
const loanProtocol = ref('')
const userKycRecordData = ref({})
const userKycRecord = async () => {
	try {
		const params = {
			userId: usersStore.userInfo.id,
		}
		loading.loading()
		const res = await fetchUserKycApi(params)
		loading.clearLoading()

		if (res.data) {
			userKycRecordData.value = res.data
		}
	} catch (error) {
		console.log(error)

		history.back()
		usersStore.SET_PATH_DATA('yes')
	}
}

// 签名
const lineWidth = ref(6)
const isCrop = ref(false)
const lineColor = ref('#000')
const bgColor = ref('')
const esign = ref(null)
const esignImg = ref(null)
const handleResetSign = () => {
	esign.value.reset()
}
const handleGenerateSign = () => {
	esign.value.generate().then((res) => {
		esignImg.value = res
	})
}

// 贷款合约数据
const loanData = ref({
	lenderName: 'xxxx', // 贷方名称
	loanDate: Date.now(), // 贷款日期
	loanAmount: 0, // 贷款金额
	loanDays: 0, // 贷款天数
	loanDayRatio: '0', // 贷款天数比率
	interest: 0, // 利息
	repaymentAmount: 0, // 还款金额
	latePaymentFee: 0, // 滞纳金
	signImg: '', // 签名照片地址
})

// 总利息 = 本金 * 天 * 日利率 / 100
const totalInterest = computed(() => {
	const loanAmount = loanOrder.value.loanAmount,
		loanDays = loanOrder.value.changeProductInfo.borrowDay,
		loanDayRatio = loanOrder.value.changeProductInfo.dayRate
	return timesDecimal(timesForValueDecimal(loanAmount || 1, loanDays), dividedForValueDecimal(loanDayRatio, 100), 2)
})

// 操作步骤
const stepPage = ref('home')
// home agreement signature confirmation success
const continueHandle = () => {
	switch (stepPage.value) {
		case 'home':
			stepPage.value = 'agreement'
			loanData.value = {
				lenderName: 'XXXX', // 贷方名称
				loanDate: formatDate(Date.now()), // 贷款日期
				loanAmount: loanOrder.value.loanAmount, // 贷款金额
				loanDays: loanOrder.value.changeProductInfo.borrowDay, // 贷款天数
				loanDayRatio: loanOrder.value.changeProductInfo.dayRate, // 贷款天数比率
				interest: totalInterest.value, // 利息
				// repaymentAmount: plusForValueDecimal(loanOrder.value.loanAmount, totalInterest.value), // 还款金额
				repaymentAmount: loanOrder.value.loanAmount, // 还款金额
				latePaymentFee: loanOrder.value.changeProductInfo.overdueRate, // 滞纳金
				signImg: esignImg.value, // 签名照片地址
			}
			break
		case 'agreement':
			stepPage.value = 'signature'
			// console.log('ddd', agreementRef.value.innerHTML, typeof agreementRef.value.innerHTML)
			loanProtocol.value = agreementRef.value && agreementRef.value.innerHTML

			break
		case 'signature':
			handleGenerateSign()
			stepPage.value = 'confirmation'
			break
		case 'confirmation':
			addLoadOrder()

			break
		case 'success':
			stepPage.value = 'home'
			router.replace('/loan-records')
			break
		default:
			break
	}
}
const onClickLeft = () => {
	switch (stepPage.value) {
		case 'home':
			history.back()
			usersStore.SET_PATH_DATA('yes')
			break
		case 'agreement':
			stepPage.value = 'home'
			break
		case 'signature':
			stepPage.value = 'agreement'
			break
		case 'confirmation':
			history.back()
			usersStore.SET_PATH_DATA('yes')
			break
		case 'success':
			stepPage.value = 'home'
			history.back()
			usersStore.SET_PATH_DATA('yes')
			break
		default:
			history.back()
			usersStore.SET_PATH_DATA('yes')
			break
	}
}

onMounted(() => {
	userKycRecord()
})
</script>
<style lang="scss" scoped>
.loan-detail {
	height: 100%;
	.block1 {
		margin-bottom: 66px;

		.p1 {
			color: #21272f;
			font-size: 32px;
			font-weight: 600;
			margin-bottom: 16px;
		}

		.p2 {
			color: var(--vt-sub-black);
			font-size: 24px;
			font-weight: 500;
		}
	}

	.btns {
		margin-top: 64px;
	}

	.lists {
		margin-bottom: 60px;
		padding: 26px;

		border-radius: 14px;
		border-top: 1.5px solid #FFF;
		background: linear-gradient(270deg, rgba(153, 153, 153, 0.30) 0%, rgba(255, 255, 255, 0.30) 100%);
		box-shadow: 0px 2px 4.4px 2px rgba(0, 0, 0, 0.15);

		.item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 28px;

			.label {
				color: var(--vt-sub-black);
				font-size: 24px;
				font-weight: 500;
			}

			.value {
				text-align: right;
				font-size: 24px;
				font-weight: 600;
				color: var(--vt-header-black);
			}
		}
	}

	.van-action-bar {
		padding: 0 25px;
		background: transparent;
		bottom:-20px;
		position: relative;
		.van-button{
			background-image: url("@/assets/images/market/p_button.png");
			background-position:  center;
			background-size: 110% 130%;
			border:none;
		}
	}

	.content {
		padding: 20px 48px 0;

		.tips {
			color: var(--vt-sub-black);
			font-size: 22px;
			font-weight: 500;

			span {
				color: #387EFF;
				font-size: 22px;
				font-weight: 600;
			}
		}
	}

	.agreement {
		height: calc(100% - 300px);

		.block2 {
			border-radius: 20px;
			border-top: 1.5px solid #FFF;
			background: linear-gradient(270deg, rgba(153, 153, 153, 0.30) 0%, rgba(255, 255, 255, 0.30) 100%);
			box-shadow: 0px 2px 4.4px 2px rgba(0, 0, 0, 0.15);
			//padding: 30px 30px 30px 20px;
			height: calc(100% - 200px);
			overflow: hidden;
			overflow-y: scroll;

			.b2p1 {
				color: #000;
				font-size: 22px;
				font-weight: 500;
				line-height: 141.591%;
				letter-spacing: -0.22px;
				margin-bottom: 26px;
			}

			h2 {
				color: #000;
				font-size: 22px;
				font-weight: 700;
				letter-spacing: -0.22px;
				margin-bottom: 26px;
			}

			.b2p2 {
				margin-bottom: 6px;
			}

			.underline {
				text-decoration: underline;
			}
		}
	}

	.signature {
		height: calc(100% - 100px);

		.block2 {
			border-radius: 28px;
			background: #cdddfe;
			height: 520px;
		}
		.van-button--primary{
			color: #fff;
			border-radius: 12px;
			background-image: url("@/assets/images/poofStake/stake_active.png");
			background-position:  center;
			background-size: 110% 140%;
			border:none;

		}
		.van-button--primary.van-button--plain{
			color: #645A6F;
			border-radius: 12px;
			background-image: url("@/assets/images/poofStake/stake_inactive.png");
			background-position:  center;
			background-size: 110% 140%;
			border:none;
		}
	}

	.confirmation {
		height: calc(100% - 100px);
		padding-left: 40px;
		padding-right: 40px;
		margin-top: 30px;
		

		.block1 {
			.p1 {
				text-align: center;
			}

			.p2 {
				text-align: center;
			}
		}

		.lists {
			margin-bottom: 30px;
			padding-left: 24px;
			padding-right: 24px;
			width: 100%;
		}
		.van-button--primary{
			color: #fff;
			border-radius: 12px;
			background-image: url("@/assets/images/poofStake/stake_active.png");
			background-position:  center;
			background-size: 110% 140%;
			border:none;

		}
		.van-button--primary.van-button--plain{
			color: #645A6F;
			border-radius: 12px;
			background-image: url("@/assets/images/poofStake/stake_inactive.png");
			background-position:  center;
			background-size: 110% 140%;
			border:none;
		}
	}

	.success {
		height: calc(100% - 100px);
		padding-left: 40px;
		padding-right: 40px;

		img {
			width: 100px;
			margin-bottom: 40px;
		}

		.block1 {
			width: 100%;
			display: flex;
			flex-direction: column;
			align-items: center;
			height: 100%;
			justify-content: center;
		}

		.p1 {
			color: var(--vt-header-black);
			font-size: 40px;
			font-weight: 700;
			margin-bottom: 40px;
		}

		.p2 {
			color: var(--vt-sub-black);
			font-size: 24px;
			font-weight: 600;
		}
		.van-button{
			background-image: url("@/assets/images/market/p_button.png");
			background-position:  center;
			background-size: 110% 130%;
			border:none;
		}
	}
}
</style>

<style lang="scss">
.loan-detail {
	.loan-treaty {
		.underline {
			text-decoration: underline;
		}
		&-wrap {
			color: #000;
			font-size: 22px;
			font-weight: 500;
			line-height: 31px;
			letter-spacing: -0.44px;
			padding: 30px 30px 20px 48px;
		}
		&_header {
			div,
			p {
				margin-top: 30px;
			}
			.preface {
				margin-top: 0;

				& + div,
				& + p {
					margin-top: 26px;
				}
			}
			.title {
				font-weight: 700;
				line-height: normal;
			}
		}
		&_content {
			margin-top: 28px;
			.title {
				margin: 20px 0 26px;
			}
		}
		&_footer {
			margin-top: 20px;
			margin-left: 0;
		}
	}
}
</style>
