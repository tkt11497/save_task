<template>
	<div class="loan-detail custom-page full-page">
		<van-nav-bar :fixed="true" :title="t('借款')" @click-left="onClickLeft">
			<template #left>
				<van-icon :name="arrow" size="18" />
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
						<span class="value">{{ loanOrder.loanAmount }} USDC</span>
					</div>
					<div class="item">
						<span class="label">{{ t('借款期限') }}</span>
						<span class="value">{{ loanOrder.itemInfo.loanDays }} {{ t('天') }}</span>
					</div>
					<div class="item">
						<span class="label">{{ t('日利率') }}:</span>
						<span class="value">{{ timesForValueDecimal(loanOrder.itemInfo.loanDayRatio, 100) }}%</span>
					</div>
					<div class="item">
						<span class="label">{{ t('总利息金额') }}:</span>
						<span class="value">{{ totalInterest }}USDC</span>
					</div>
				</div>
				<div class="tips">
					{{ t('请确认并签字') }} <span>{{ t('贷款协议') }}</span>
				</div>
			</div>
			<van-action-bar>
				<van-button plain type="primary" @click="continueHandle()">{{ t('下一步') }}</van-button>
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
					<!--					<p class="b2p1">Loan Agreement (" xxxx ") dated {{ formatDate(new Date()) }} ("Effective Date")-->
					<!--						entered into by the following parties:</p>-->
					<!--					<h2>Borrower:</h2>-->
					<!--					<p class="b2p1">First name: {{ userKycRecordData.firstName }}</p>-->
					<!--					<p class="b2p1">Last name: {{ userKycRecordData.lastName }}</p>-->
					<!--					<p class="b2p1">Address: {{ userKycRecordData.detailAddress }}</p>-->
					<!--					<p class="b2p1">Phone: {{ userKycRecordData.phone }}</p>-->
					<!--					<h2>Lender:</h2>-->
					<!--					<p class="b2p1">Name: xxxx</p>-->
					<!--					<p class="b2p1">Together referred to as the "Parties".</p>-->
					<!--					<p class="b2p1">Repayment Terms:</p>-->
					<!--					<p class="b2p1">-->
					<!--						1. Loan Amount: {{ loanOrder.loanAmount }} <br />-->
					<!--						2. Borrower agrees to repay ${{ loanOrder.loanAmount }} ("Loan").<br />-->
					<!--						3. Interest Rate: {{ loanOrder.itemInfo.loanDayRatio / 100 }}%<br />-->
					<!--						4. The agreed-upon interest rate is {{ loanOrder.itemInfo.loanDayRatio / 100 }}% (calculated on-->
					<!--						a daily basis). <br />-->
					<!--						5. Loan Term: {{ loanOrder.itemInfo.loanDays }} <br />-->
					<!--						6. The term of this loan is {{ loanOrder.itemInfo.loanDays }} days.<br />-->
					<!--						7. Repayment Method:<br />-->
					<!--						8. Borrower agrees to repay Lender ${{ loanOrder.loanAmount }} principal and $-->
					<!--						{{ ((loanOrder.itemInfo.loanDayRatio / 100) * loanOrder.itemInfo.loanDays).toFixed(2) }}-->
					<!--						interest upon maturity.-->
					<!--					</p>-->
					<!--					<p class="b2p1">Repayment Applicability:</p>-->
					<!--					<p class="b2p1 b2p2">1. Late Payment Fee: 2%</p>-->
					<!--					<p class="b2p1 b2p2">-->
					<!--						2. If Borrower fails to repay on time, Borrower shall pay a late fee of 2% (calculated on a-->
					<!--						daily basis), which shall be considered a-->
					<!--						penalty rather than a fine.-->
					<!--					</p>-->
					<!--					<p class="b2p1 b2p2">3. Early Repayment:</p>-->
					<!--					<p class="b2p1 b2p2">4. No penalty shall be imposed on Borrower for early repayment.</p>-->
					<!--					<p class="b2p1 b2p2">5.Default:</p>-->
					<!--					<p class="b2p1 b2p2">-->
					<!--						6. If Borrower fails to repay on time, Borrower shall immediately pay all outstanding principal-->
					<!--						and interest without the need for notice-->
					<!--						or demand.-->
					<!--					</p>-->
					<!--					<p class="b2p1 b2p2">7. Fees:</p>-->
					<!--					<p class="b2p1 b2p2">-->
					<!--						8. If Borrower fails to fulfill the repayment obligation on time, Borrower agrees to bear all-->
					<!--						costs incurred by Lender in the collection-->
					<!--						process, including but not limited to attorney's fees.-->
					<!--					</p>-->
					<!--					<p class="b2p1 b2p2">9. Severability:</p>-->
					<!--					<p class="b2p1 b2p2">-->
					<!--						10. If any provision of this Agreement is found to be invalid or unenforceable, such provision-->
					<!--						shall be voided, but all other provisions-->
					<!--						shall remain valid and binding.-->
					<!--					</p>-->
					<!--					<p class="b2p1 b2p2">11. Legal Effect:</p>-->
					<!--					<p class="b2p1 b2p2">-->
					<!--						12. This Agreement is legally binding on both parties and may be signed and executed within the-->
					<!--						United States and Europe. Both parties-->
					<!--						declare that they have the authority to sign this Agreement.-->
					<!--					</p>-->
					<!--					<p class="b2p1 b2p2">13. Miscellaneous:</p>-->
					<!--					<p class="b2p1 b2p2">-->
					<!--						14. According to the terms of this Agreement, the company shall pay in the form of currency in-->
					<!--						the account balance. Both parties have the-->
					<!--						right to sign this Agreement. Neither party shall infringe upon the rights of third parties or-->
					<!--						violate any other agreements between the-->
					<!--						parties.-->
					<!--					</p>-->
					<!--					<p class="b2p1 b2p2">15. Applicable Law:</p>-->
					<!--					<p class="b2p1 b2p2">-->
					<!--						16. This Agreement shall be interpreted and enforced in accordance with the laws of the country-->
					<!--						in which the borrower is located.-->
					<!--					</p>-->
					<!--					<p class="b2p1 b2p2">17. Entire Agreement:</p>-->
					<!--					<p class="b2p1">-->
					<!--						18. Both parties confirm and agree that this Agreement constitutes the entire agreement between-->
					<!--						the parties. If either party wishes to-->
					<!--						change, add, or modify any provision, it must be done in writing and signed by both parties.-->
					<!--					</p>-->
					<!--					<p class="b2p1">Both parties agree to the above terms and conditions and sign as follows:</p>-->
					<!--					<p class="b2p1">Lender:</p>-->
					<!--					<p class="b2p1">"Borrower"</p>-->
					<!--					<p class="b2p1">-->
					<!--						Borrower Signature: <span class="underline"> <img width="40px" height="40px" :src="esignImg"-->
					<!--								alt="" /> </span>-->
					<!--					</p>-->
					<!--					<p class="b2p1">-->
					<!--						Signature Date: <span class="underline">{{ formatDate(new Date()) }}</span>-->
					<!--					</p>-->
				</div>
			</div>
			<van-action-bar>
				<van-button plain type="primary" @click="continueHandle()">{{ t('同意') }}</van-button>
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
				<div class="btns">
					<van-button plain type="primary" @click="handleResetSign">{{ t('重签') }}</van-button>
					<van-button plain type="primary" @click="continueHandle()">{{ t('下一步') }}</van-button>
				</div>
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
						<span class="value">{{ loanOrder.loanAmount }} USDC</span>
					</div>
					<div class="item">
						<span class="label">{{ t('借款期限') }}</span>
						<span class="value">{{ loanOrder.itemInfo.loanDays }} {{ t('天') }}</span>
					</div>
					<div class="item">
						<span class="label">{{ t('日利率') }}:</span>
						<span class="value">{{ timesForValueDecimal(loanOrder.itemInfo.loanDayRatio, 100) }}%</span>
					</div>
					<div class="item">
						<span class="label">{{ t('总利息金额') }}:</span>
						<span class="value">{{ totalInterest }}USDC</span>
					</div>
				</div>
				<div class="btns">
					<van-button plain type="primary" @click="onClickLeft()">{{ t('取消') }}</van-button>
					<van-button plain type="primary" @click="continueHandle()">{{ t('确认') }}</van-button>
				</div>
			</div>
		</template>
		<template v-if="stepPage === 'success'">
			<div class="content success">
				<div class="block1">
					<img src="@/assets/images/user/check_circle.png" alt="" />
					<p class="p1">{{ t('成功完成！') }}</p>
					<p class="p2">{{ t('申请成功，请等待审核') }}</p>
					<van-button plain type="primary" @click="continueHandle()">{{ t('前往记录') }}</van-button>
				</div>
			</div>
		</template>
	</div>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue'
import { userStore } from '@/store'
import { storeToRefs } from 'pinia'
import arrow from '@/assets/images/user/arrow.png'
import { addLoanOrder, userKycRecordLatestApi } from '@/apiService'
import { formatDate, timesDecimal, timesForValueDecimal } from '@/utils'
import vueEsign from 'vue-esign'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import useLoading from '@/hooks/useLoading.js'
import LoanTreaty from '@/views/user/loan/loan-treaty.vue'

const usersStore = userStore()
const { loanOrder } = storeToRefs(usersStore)
const { t } = useI18n()
const router = useRouter()
const loading = useLoading()

const addLoadOrder = async () => {
	try {
		const { userId, loanProductId, loanAmount, orderCurrency } = loanOrder.value
		const params = {
			userId,
			loanProductId,
			loanAmount: loanAmount * 1,
			orderCurrency,
			// loanProtocol: loanProtocol.value,
			signName: esignImg.value,
		}
		loading.loading()
		const res = await addLoanOrder(params)
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
		const res = await userKycRecordLatestApi(params)
		loading.clearLoading()

		if (res.data) {
			userKycRecordData.value = res.data
		}
	} catch (error) {
		console.log(error)

		// if (res.success === false) {
		history.back()
		usersStore.SET_PATH_DATA('yes')
		// return
		// }
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
	loanDayRatio: '0%', // 贷款天数比率
	interest: 0, // 利息
	repaymentAmount: 0, // 还款金额
	latePaymentFee: 0, // 滞纳金
	signImg: '', // 签名照片地址
})

// 总利息 = 本金 * 天 * 日利率
const totalInterest = computed(() => {
	const loanAmount = loanOrder.value.loanAmount,
		loanDays = loanOrder.value.itemInfo.loanDays,
		loanDayRatio = loanOrder.value.itemInfo.loanDayRatio
	return timesDecimal(timesForValueDecimal(loanAmount || 1, loanDays), loanDayRatio, 2)
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
				loanDays: loanOrder.value.itemInfo.loanDays, // 贷款天数
				loanDayRatio: timesForValueDecimal(loanOrder.value.itemInfo.loanDayRatio, 100), // 贷款天数比率
				interest: totalInterest.value, // 利息
				repaymentAmount: loanOrder.value.loanAmount, // 还款金额
				latePaymentFee: timesForValueDecimal(loanOrder.value.itemInfo.dayViolationRatio, 100), // 滞纳金
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
			color: #797979;
			font-size: 24px;
			font-weight: 500;
		}
	}

	.van-button {
		background: #82a9f9;
		border-radius: 25px;
		width: 100%;
		height: 53px;
		font-size: 14px;
		font-weight: 700;
		line-height: 16.94px;
		text-align: center;
		color: #fff;
		margin-top: 46px;
	}

	.btns {
		width: 100%;
		display: flex;

		.van-button {
			background: #82a9f9;
			border-radius: 25px;
			height: 42px;
			font-size: 14px;
			flex: 1;
			font-weight: 700;
			line-height: 16.94px;
			text-align: center;
			color: #fff;

			&:first-child {
				margin-right: 17px;
				background: transparent;
				color: #82a9f9;
			}
		}
	}

	.lists {
		margin-bottom: 100px;
		padding-left: 26px;
		padding-right: 26px;

		.item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-bottom: 28px;

			.label {
				color: #7e7e7e;
				font-size: 20px;
				font-weight: 500;
			}

			.value {
				text-align: right;
				font-size: 20px;
				font-weight: 600;
				color: #000;
			}
		}
	}

	.van-action-bar {
		padding: 0 25px;
		bottom: 44px;
		position: relative;
	}

	.content {
		padding: 20px 48px 0;

		.tips {
			color: #7e7e7e;
			font-size: 22px;
			font-weight: 500;

			span {
				color: #000;
				font-size: 22px;
				font-weight: 600;
			}
		}
	}

	.agreement {
		height: calc(100% - 100px);

		.block2 {
			border-radius: 20px;
			border: 2px dashed #363636;
			background: #d9e5fb;
			//padding: 30px 30px 30px 20px;
			height: calc(100% - 400px);
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
	}

	.confirmation {
		height: calc(100% - 100px);
		padding-left: 40px;
		padding-right: 40px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.block1 {
			.p1 {
				text-align: center;
			}

			.p2 {
				text-align: center;
			}
		}

		.lists {
			margin-bottom: 40px;
			padding-left: 24px;
			padding-right: 24px;
			width: 100%;
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
			color: #222;
			font-size: 40px;
			font-weight: 700;
			margin-bottom: 40px;
		}

		.p2 {
			color: #797979;
			font-size: 24px;
			font-weight: 600;
		}

		.van-button {
			background: #82a9f9;
			border-radius: 25px;
			width: 100%;
			height: 43px;
			font-size: 14px;
			font-weight: 700;
			line-height: 16.94px;
			text-align: center;
			color: #fff;
			margin-top: 18px;
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
