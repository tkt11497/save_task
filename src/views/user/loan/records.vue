<template>
	<div class="loan-order custom-page full-page">
		<van-nav-bar :fixed="true" :title="t('贷款订单')" @click-left="onClickLeft">
			<template #left>
				<van-icon :name="arrow" size="18" />
			</template>
		</van-nav-bar>
		<div class="content">
			<van-pull-refresh v-model="refreshing" @refresh="onRefresh" :loosing-text="t('释放即可刷新')">
				<van-list
					v-model:loading="listLoading"
					v-model:error="listError"
					:error-text="t('请求失败，点击重新加载')"
					:finished="finished"
					:finished-text="isEmptyList ? '' : t('没有更多了')"
					@load="onLoad"
				>
					<template #loading>
						<van-loading class="custom-page-loading" type="spinner" />
					</template>

					<div v-if="accountList.length == 0" class="container">
						<div class="notice">
							<img src="../../../assets/images/user/notice.png" alt="notice" />
						</div>
						<div class="title">{{ t('哎呀！') }}</div>
						<div class="info">
							{{ t('您还没有任何交易。') }}
						</div>
						<div class="info">{{ t('列表为空') }}</div>
					</div>
					<div v-else class="each-block" v-for="(list, ind1) in accountList" :key="ind1">
						<div class="each-container">
							<div class="title1-row">
								<img src="@/assets/images/record/loan.png" class="img-css" alt="notice" />
								<p class="day-text">{{ $t('贷款订单') }}</p>
							</div>

							<div class="content-row">
								<p class="left-text">{{ t('金额') }}:</p>
								<p class="right-text">{{ list.loanAmount || 0 }} {{ list.orderCurrency }}</p>
							</div>
							<div class="content-row">
								<p class="left-text">{{ t('借款期限') }}:</p>
								<p class="right-text">{{ list.loanDays }} {{ $t('天') }}</p>
							</div>
							<div class="content-row">
								<p class="left-text">{{ t('总利息') }}:</p>
								<p class="right-text">{{ list.totalProfit || 0 }} {{ list.orderCurrency }}</p>
							</div>
							<div class="content-row">
								<p class="left-text">{{ t('每日利率') }}:</p>
								<p class="right-text">{{ timesForValueDecimal(list.dailyInterestRate, 100) }}%</p>
							</div>
							<div class="content-row">
								<p class="left-text">{{ t('需要还款') }}:</p>
								<p class="right-text">{{ list.repaymentRequired || 0 }} {{ list.orderCurrency }}</p>
							</div>
							<div class="content-row">
								<p class="left-text">{{ t('逾期') }}:</p>
								<p class="right-text">{{ list.overdueDay }}{{ $t('天') }}</p>
							</div>
							<div class="content-row">
								<p class="left-text">{{ t('违约金') }}:</p>
								<p class="right-text">{{ list.penaltyAmount || 0 }} {{ list.orderCurrency }}</p>
							</div>
							<div class="content-row">
								<p class="left-text">{{ t('认可') }}:</p>
								<p class="right-text">{{ list.loanReviewTime }}</p>
							</div>
							<div class="content-row">
								<p class="left-text">{{ t('还款日期') }}:</p>
								<p class="right-text">{{ list.loanEndTime }}</p>
							</div>
						</div>
						<div class="confirm-btn confirm-btn2">
							<el-button plain @click="checkItem(list, 'contract')" class="btn-css">
								{{ t('合同') }}
							</el-button>
							<el-button v-if="!list.repaymentStatus" plain @click="checkItem(list)" class="btn-css">
								{{ t('立即还款') }}
							</el-button>

							<el-button v-else-if="list.repaymentStatus" plain disabled class="btn-css">
								{{ t('已还款') }}
							</el-button>
						</div>
					</div>
				</van-list>
			</van-pull-refresh>
		</div>

		<van-popup class="announcement-pop" overlay-class="announcement-pop-layer" v-model:show="showPop" @closed="closed">
			<div class="node-add">
				<div class="title">
					<img src="@/assets/images/record/loan.png" class="icon" alt="" />
					<span class="h1">{{ t('还款') }}</span>
					<span>{{ t('确认您的还款日期') }}</span>
				</div>
				<!-- <van-divider /> -->
				<div class="rich-conetent">
					<div class="each-row">
						<p class="left-text">{{ t('金额') }}:</p>
						<p class="right-text">{{ rowData.loanAmount || 0 }} {{ rowData.orderCurrency }}</p>
					</div>
					<div class="each-row">
						<p class="left-text">{{ t('总利息') }}:</p>
						<p class="right-text">{{ rowData.totalProfit || 0 }} {{ rowData.orderCurrency }}</p>
					</div>
					<div class="each-row">
						<p class="left-text">{{ t('违约金') }}:</p>
						<p class="right-text">{{ rowData.penaltyAmount || 0 }} {{ rowData.orderCurrency }}</p>
					</div>
					<div class="each-row">
						<p class="left-text">{{ t('需要还款') }}:</p>
						<p class="right-text">{{ rowData.repaymentRequired || 0 }} {{ rowData.orderCurrency }}</p>
					</div>
				</div>
				<!-- <van-divider /> -->
				<van-button class="btn" size="small" type="primary" @click="showUserBalance">{{ t('确认') }}</van-button>
			</div>
		</van-popup>

		<van-popup class="contact-pop" overlay-class="announcement-pop-layer" v-model:show="showContactPop" position="bottom">
			<div class="agreement">
				<div class="block1">
					<p class="p1">{{ t('您的贷款协议') }}</p>
					<p class="p2">{{ t('请检查您的贷款详情并确认') }}</p>
				</div>
				<div class="block2" ref="agreementRef">
					<loan-treaty :user-data="userKycRecordData" :loan-data="loanData" />
					<!--                    <p class="b2p1">Loan Agreement (" xxxx ") dated {{ rowData.createTime }} ("Effective Date")-->
					<!--                        entered into by the following parties:</p>-->
					<!--                    <h2>Borrower:</h2>-->
					<!--                    <p class="b2p1">First name: {{ userKycRecordData.firstName }}</p>-->
					<!--                    <p class="b2p1">Last name: {{ userKycRecordData.lastName }}</p>-->
					<!--                    <p class="b2p1">Address: {{ userKycRecordData.detailAddress }}</p>-->
					<!--                    <p class="b2p1">Phone: {{ userKycRecordData.phone }}</p>-->
					<!--                    <h2>Lender:</h2>-->
					<!--                    <p class="b2p1">Name: xxxx</p>-->
					<!--                    <p class="b2p1">Together referred to as the "Parties".</p>-->
					<!--                    <p class="b2p1">Repayment Terms:</p>-->
					<!--                    <p class="b2p1">-->
					<!--                        1. Loan Amount: {{ rowData.loanAmount }} <br />-->
					<!--                        2. Borrower agrees to repay ${{ rowData.loanAmount }} ("Loan").<br />-->
					<!--                        3. Interest Rate: {{ rowData.dailyInterestRate * 100 }}%<br />-->
					<!--                        4. The agreed-upon interest rate is {{ rowData.dailyInterestRate * 100 }}% (calculated on-->
					<!--                        a daily basis). <br />-->
					<!--                        5. Loan Term: {{ rowData.loanDays }} <br />-->
					<!--                        6. The term of this loan is {{ rowData.loanDays }} days.<br />-->
					<!--                        7. Repayment Method:<br />-->
					<!--                        8. Borrower agrees to repay Lender ${{ rowData.loanAmount }} principal and $-->
					<!--                        {{ ((rowData.dailyInterestRate) * rowData.loanDays * rowData.loanAmount).toFixed(2) }}-->
					<!--                        interest upon maturity.-->
					<!--                    </p>-->
					<!--                    <p class="b2p1">Repayment Applicability:</p>-->
					<!--                    <p class="b2p1 b2p2">1. Late Payment Fee: {{ rowData.accruedInterest * 100 }}%</p>-->
					<!--                    <p class="b2p1 b2p2">-->
					<!--                        2. If Borrower fails to repay on time, Borrower shall pay a late fee of-->
					<!--                        {{ rowData.accruedInterest *-->
					<!--                            100 }}% (calculated on a-->
					<!--                        daily basis), which shall be considered a-->
					<!--                        penalty rather than a fine.-->
					<!--                    </p>-->
					<!--                    <p class="b2p1 b2p2">3. Early Repayment:</p>-->
					<!--                    <p class="b2p1 b2p2">4. No penalty shall be imposed on Borrower for early repayment.</p>-->
					<!--                    <p class="b2p1 b2p2">5.Default:</p>-->
					<!--                    <p class="b2p1 b2p2">-->
					<!--                        6. If Borrower fails to repay on time, Borrower shall immediately pay all outstanding principal-->
					<!--                        and interest without the need for notice-->
					<!--                        or demand.-->
					<!--                    </p>-->
					<!--                    <p class="b2p1 b2p2">7. Fees:</p>-->
					<!--                    <p class="b2p1 b2p2">-->
					<!--                        8. If Borrower fails to fulfill the repayment obligation on time, Borrower agrees to bear all-->
					<!--                        costs incurred by Lender in the collection-->
					<!--                        process, including but not limited to attorney's fees.-->
					<!--                    </p>-->
					<!--                    <p class="b2p1 b2p2">9. Severability:</p>-->
					<!--                    <p class="b2p1 b2p2">-->
					<!--                        10. If any provision of this Agreement is found to be invalid or unenforceable, such provision-->
					<!--                        shall be voided, but all other provisions-->
					<!--                        shall remain valid and binding.-->
					<!--                    </p>-->
					<!--                    <p class="b2p1 b2p2">11. Legal Effect:</p>-->
					<!--                    <p class="b2p1 b2p2">-->
					<!--                        12. This Agreement is legally binding on both parties and may be signed and executed within the-->
					<!--                        United States and Europe. Both parties-->
					<!--                        declare that they have the authority to sign this Agreement.-->
					<!--                    </p>-->
					<!--                    <p class="b2p1 b2p2">13. Miscellaneous:</p>-->
					<!--                    <p class="b2p1 b2p2">-->
					<!--                        14. According to the terms of this Agreement, the company shall pay in the form of currency in-->
					<!--                        the account balance. Both parties have the-->
					<!--                        right to sign this Agreement. Neither party shall infringe upon the rights of third parties or-->
					<!--                        violate any other agreements between the-->
					<!--                        parties.-->
					<!--                    </p>-->
					<!--                    <p class="b2p1 b2p2">15. Applicable Law:</p>-->
					<!--                    <p class="b2p1 b2p2">-->
					<!--                        16. This Agreement shall be interpreted and enforced in accordance with the laws of the country-->
					<!--                        in which the borrower is located.-->
					<!--                    </p>-->
					<!--                    <p class="b2p1 b2p2">17. Entire Agreement:</p>-->
					<!--                    <p class="b2p1">-->
					<!--                        18. Both parties confirm and agree that this Agreement constitutes the entire agreement between-->
					<!--                        the parties. If either party wishes to-->
					<!--                        change, add, or modify any provision, it must be done in writing and signed by both parties.-->
					<!--                    </p>-->
					<!--                    <p class="b2p1">Both parties agree to the above terms and conditions and sign as follows:</p>-->
					<!--                    <p class="b2p1">Lender:</p>-->
					<!--                    <p class="b2p1">"Borrower"</p>-->
					<!--                    <p class="b2p1">-->
					<!--                        Borrower Signature: <span class="underline"> <img width="40px" height="40px"-->
					<!--                                :src="rowData.signName" alt="" />-->
					<!--                        </span>-->
					<!--                    </p>-->
					<!--                    <p class="b2p1">-->
					<!--                        Signature Date: <span class="underline">{{ rowData.createTime }}</span>-->
					<!--                    </p>-->
				</div>
			</div>
		</van-popup>

		<van-popup class="user-balance-pop" overlay-class="user-balance-pop-layer" v-model:show="showUserBalancePop" @closed="closed">
			<div class="node-add">
				<div class="title">
					<img src="@/assets/images/record/loan.png" class="icon" alt="" />
					<span class="h1">{{ t('还款') }}</span>
					<span>{{ t('您的钱包余额') }}</span>
				</div>
				<!-- <van-divider /> -->
				<div class="rich-conetent">
					<div class="each-row">
						<p class="left-text">{{ rowData.orderCurrency?.toUpperCase() }}:</p>
						<p class="right-text balance">{{ userWalletBalance }}</p>
					</div>
				</div>

				<van-button class="btn" size="small" type="primary" @click="confirmRepayment">{{ t('确认') }}</van-button>
			</div>
		</van-popup>
	</div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { userStore } from '@/store'
import arrow from '@/assets/images/user/arrow.png'
import { useRouter } from 'vue-router'
import { loanOrderListeApi, loanRepaymentClientAddApi, userKycRecordLatestApi } from '@/apiService'
import { useI18n } from 'vue-i18n'
import { formatDate, timesForValueDecimal } from '@/utils'
import useLoading from '@/hooks/useLoading.js'
import LoanTreaty from '@/views/user/loan/loan-treaty.vue'
import { useToken } from '@/hooks/useToken.js'

const usersStore = userStore()
const router = useRouter()
const { t } = useI18n()
const loading = useLoading()

// list 滚动加载
const pageData = ref({
	pageSize: 20,
	pageNum: 0,
	total: 0,
})
const listError = ref(false)
const listLoading = ref(false)
const finished = ref(false)
const refreshing = ref(false)
const isEmptyList = ref(false)
const onLoad = async () => {
	try {
		isEmptyList.value = false

		if (refreshing.value) {
			refreshing.value = false
		}

		if (pageData.value.pageNum == 0) {
			accountList.value = []
			pageData.value.total = 0
			finished.value = false
		}

		const response = await loanOrderList({
			pageSize: pageData.value.pageSize,
			pageNum: pageData.value.pageNum + 1,
		})

		listError.value = false
		pageData.value.pageNum += 1
		pageData.value.total = response.total

		if (accountList.value.length >= response.total) {
			finished.value = true
		} else {
			finished.value = false
		}
		if (!response.total) {
			isEmptyList.value = true
		}
	} catch (e) {
		listError.value = true
	} finally {
		listLoading.value = false
	}
}
const onRefresh = async () => {
	// 清空列表数据
	finished.value = false
	listLoading.value = true

	// 重新加载数据
	pageData.value.pageNum = 0
	onLoad()
}

const accountList = ref([])
// loanReviewStatus -1 未审核 0  审核中 1审核通过 2审核驳回
const loanOrderList = async (pageData) => {
	try {
		const res = await loanOrderListeApi(pageData)
		accountList.value = accountList.value.concat(res.rows || [])
		return res
	} catch (err) {
		console.log(err)
	}
}

const showPop = ref(false)

const confirmRepayment = async () => {
	try {
		const params = {
			loanOrderId: rowData.value.id,
			loanAmount: rowData.value.loanAmount,
		}
		loading.loading()
		const res = await loanRepaymentClientAddApi(params)
		loading.clearLoading()
		showPop.value = false
		showUserBalancePop.value = false

		onRefresh()
	} catch (err) {
		console.log(err)
	}
}
const closed = () => {}

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
const rowData = ref({})
const checkItem = (item, type = '') => {
	rowData.value = item
	loanData.value = {
		lenderName: 'XXXX', // 贷方名称
		loanDate: formatDate(rowData.value.createTime), // 贷款日期
		loanAmount: rowData.value.loanAmount, // 贷款金额
		loanDays: rowData.value.loanDays, // 贷款天数
		loanDayRatio: timesForValueDecimal(rowData.value.dailyInterestRate, 100), // 贷款天数比率
		interest: rowData.value.totalProfit, // 利息
		repaymentAmount: rowData.value.loanAmount, // 还款金额
		latePaymentFee: timesForValueDecimal(rowData.value.dailyDefaultInterestRate, 100), // 滞纳金
		signImg: rowData.value.signName, // 签名照片地址
	}
	if (type === 'contract') {
		showContactPop.value = true
	} else {
		showPop.value = true
	}
}
// 合同
const showContactPop = ref(false)
const userKycRecordData = ref({})
const userKycRecord = async () => {
	try {
		const params = {
			userId: usersStore.userInfo.id,
		}
		const res = await userKycRecordLatestApi(params)
		if (res.data) {
			userKycRecordData.value = res.data
		}
	} catch (error) {
		console.log(error)
	}
}

const { balance: tokenBalance, getBalance } = useToken()
const userWalletBalance = ref(0)
const showUserBalancePop = ref(false)
const showUserBalance = () => {
	showPop.value = false
	getBalance(rowData.value.orderCurrency, (val) => {
		userWalletBalance.value = val || tokenBalance.value || 0
		showUserBalancePop.value = true
	})
}

const onClickLeft = () => {
	router.back()
	usersStore.SET_PATH_DATA('no')
}

onMounted(() => {
	userKycRecord()
})
</script>
<style lang="scss" scoped>
.loan-order {
	position: relative;
	padding-bottom: 20px;
	padding-left: 48px;
	padding-right: 48px;
	background: #f5f5f5;

	.content {
		margin: 32px 0;
		.each-block {
			background: #fff;
			padding: 34px;
			margin-bottom: 32px;
			border-radius: 32px;

			.each-container {
				position: relative;
				margin: 24px 0;
			}

			.title-row,
			.title1-row,
			.content-row {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 20px;

				.day-text {
					color: #000;
					font-size: 28px;
					font-weight: 500;
				}

				.img-css {
					width: 48px;
					height: 48px;
					margin-right: 8px;
				}

				.left-text {
					font-size: 24px;
					font-weight: 400;
					color: #999;
				}

				.right-text {
					font-size: 24px;
					font-weight: 500;
					color: #000;
				}

				.uptext {
					color: #1eb500;
				}

				.downtext {
					color: red;
				}
			}

			.title1-row {
				justify-content: unset;
				position: relative;
				margin-bottom: 30px;
			}

			.title-row {
				position: relative;
				padding-left: 20px;
			}

			.title-row1::before {
				content: '';
				position: absolute;
				top: 50%;
				margin-top: -16px;
				left: 0;
				width: 8px;
				height: 32px;
				background-color: #7ba9ff;
				border-radius: 0.3rem;
			}

			.content-row {
				margin-bottom: 40px;
				line-height: 28px;
			}
		}

		.notice {
			width: 0.56rem;
			margin: 50% auto 20%;
			background: #82a9f9;
			display: flex;
			align-items: center;
			justify-content: center;

			img {
				background: #82a9f9;
				border-radius: 1.9rem;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 1.5rem;
				height: 1.5rem;
			}
		}

		.confirm-btn {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin: 0 -20px;

			.btn-css {
				color: #fff;
				height: 1rem;
				background: var(--01, #82a9f9);
				border-radius: 0.45rem;
				width: 90%;
				margin: 0;
				flex: 1;
				margin: 0 20px;

				&:first-child {
					background: #fff;
					color: #82a9f9;
					border: 1px solid #82a9f9;
				}

				&:focus {
					background: #1d2a5e;
					background: var(--01, #82a9f9);
				}
				&.is-disabled {
					opacity: 0.7;
				}
			}

			.waning-css {
				width: 24px;
				height: 24px;
			}

			.title-text {
				font-size: 24px;
			}

			.dialog-footer {
				text-align: center;
			}
		}

		.confirm-btn2 {
			.btn-css {
				height: 90px;
				border-radius: 50px;
				font-size: 32px;
			}
		}

		.title {
			font-weight: 500;
			font-size: 0.54rem;
			color: #121212;
			text-align: center;
			margin-top: 1rem;
		}

		.info {
			margin: auto;
			width: 4rem;
			font-weight: 500;
			font-size: 0.36rem;
			text-align: center;
			color: #a6a6a6;
		}
	}
}

.announcement-pop-layer,
.user-balance-pop-layer {
	background: rgba($color: #000000, $alpha: 0.45);
}

.announcement-pop,
.user-balance-pop {
	width: calc(100% - 40px);
	min-height: 400px;
	border-radius: 26px;

	.node-add {
		border-radius: 26px;
		font-size: 26px;
		padding: 54px 54px 60px;
		display: flex;
		flex-direction: column;
		align-items: center;

		.icon {
			width: 80px;
			height: 80px;
			margin-bottom: 8px;
		}

		.title {
			margin-bottom: 20px;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			color: #999;
			font-size: 24px;

			.h1 {
				font-size: 40px;
				font-weight: 600;
				color: #000;
				margin-bottom: 8px;
			}
		}

		.rich-conetent {
			width: 100%;
			min-height: 300px;
			max-height: 600px;
			overflow-y: scroll;
			padding: 20px 8px 10px;
			color: #000000;
			font-size: 32px;

			.each-row {
				display: flex;
				justify-content: space-between;
				margin-bottom: 40px;

				.left-text,
				.right-text {
					font-size: 24px;
					font-weight: 500;
					color: #999;
				}

				.right-text {
					font-weight: 500;
					color: #000;

					&.balance {
						font-weight: bold;
					}
				}
			}
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
		}

		.btn {
			background: #82a8f9;
			border-radius: 52px;
			color: #fff;
			font-size: 32px;
			font-weight: 600;
			width: 100%;
			height: 90px;
			border-color: transparent;
		}
	}
}

.contact-pop {
	height: 80%;
	overflow: hidden;

	.agreement {
		padding: 100px 48px 48px;
		height: calc(100vh - 100px);

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
				font-size: 28px;
				font-weight: 500;
			}
		}

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
}
</style>

<style lang="scss">
.loan-order {
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
