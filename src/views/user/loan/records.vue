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

					<div v-if="!dataList.length" class="container">
						<div class="notice">
							<img src="../../../assets/images/user/notice.png" alt="notice" />
						</div>
						<div class="title">{{ t('哎呀！') }}</div>
						<div class="info">
							{{ t('您还没有任何交易。') }}
						</div>
						<div class="info">{{ t('列表为空') }}</div>
					</div>
					<div v-else class="each-block" v-for="(list, ind1) in dataList" :key="ind1">
						<div class="each-container">
							<div class="title1-row">
								<img src="@/assets/images/record/loan.png" class="img-css" alt="notice" />
								<span class="day-text">{{ $t('贷款订单') }}</span>
							</div>

							<div class="content-row">
								<p class="left-text">{{ t('金额') }}:</p>
								<p class="right-text">{{ list.borrowAmount || 0 }} {{ list.walletToken }}</p>
							</div>
							<div class="content-row">
								<p class="left-text">{{ t('借款期限') }}:</p>
								<p class="right-text">{{ list.borrowDay }} {{ $t('天') }}</p>
							</div>
							<div class="content-row">
								<p class="left-text">{{ t('总利息') }}:</p>
								<p class="right-text">{{ list.interest || 0 }} {{ list.walletToken }}</p>
							</div>
							<div class="content-row">
								<p class="left-text">{{ t('每日利率') }}:</p>
								<p class="right-text">{{ list.dayRate }}%</p>
							</div>
							<!--							<div class="content-row">-->
							<!--								<p class="left-text">{{ t('逾期') }}:</p>-->
							<!--								<p class="right-text">{{}}{{ $t('天') }}</p>-->
							<!--							</div>-->
							<div class="content-row">
								<p class="left-text">{{ t('违约金') }}:</p>
								<p class="right-text">{{ list.overdueInterest || 0 }} {{ list.walletToken }}</p>
							</div>
							<div class="content-row">
								<p class="left-text">{{ t('需要还款') }}:</p>
								<p class="right-text">
									{{ plusForValueDecimal(list.overdueInterest, plusForValueDecimal(list.borrowAmount, list.interest)) }} {{ list.walletToken }}
								</p>
							</div>

							<!-- todo 借贷状态-->
							<!-- 订单未结束 并且 未开始还款时，显示贷款状态-->
							<div class="content-row" v-if="list.status !== 3 && list.repaymentStatus === 0">
								<p class="left-text">{{ t('状态') }}:</p>
								<p class="right-text">
									<!-- "状态(0:未审核,1:审核通过,2:审核失败,3:订单结束)" -->
									<Status v-if="list.status === 0" status="process" />
									<Status v-else-if="list.status === 1" status="success" />
									<Status v-else-if="list.status === 2" status="fail" />
								</p>
							</div>

							<!-- 贷款申请成功 或 贷款结束-->
							<div class="content-row" v-if="list.status === 1 || list.status === 3">
								<p class="left-text">{{ t('认可') }}:</p>
								<p class="right-text">{{ formatDate(list.startDate) }}</p>
							</div>

							<!-- 贷款申请成功 并 开始还款-->
							<div class="content-row" v-if="list.repaymentStatus !== 0">
								<p class="left-text">{{ t('还款状态') }}:</p>
								<p class="right-text">
									<!-- 还款状态(0.未还款；1.提交还款;2.审核通过;3.审核失败) -->
									<Status v-if="list.repaymentStatus === 1" status="process" />
									<Status v-else-if="list.repaymentStatus === 2" status="success" />
									<Status v-else-if="list.repaymentStatus === 3" status="fail" />
								</p>
							</div>

							<!--  还款申请成功 才显示还款日期-->
							<div class="content-row" v-if="list.repaymentStatus === 2">
								<p class="left-text">{{ t('还款日期') }}:</p>
								<p class="right-text">{{ formatDate(list.repaymentDate) }}</p>
							</div>

							<!-- 借贷审核成功或贷款订单结束-->
							<!--							<template v-if="list.status === 1 || list.status === 3">-->
							<!--								<template v-if="list.repaymentStatus !== 0">-->
							<!--									<div class="content-row">-->
							<!--										<p class="left-text">{{ t('还款日期') }}:</p>-->
							<!--										<p class="right-text">{{ formatDate(list.endDate) }}</p>-->
							<!--									</div>-->
							<!--								</template>-->
							<!--							</template>-->
						</div>
						<van-space :size="10" fill class="item-block">
							<van-button type="primary" block round plain @click="checkItem(list, 'contract')">
								{{ t('合同') }}
							</van-button>

							<template v-if="list.status === 1">
								<van-button type="primary" block round v-if="list.repaymentStatus === 0 || list.repaymentStatus === 3" @click="checkItem(list)">
									{{ t('立即还款') }}
								</van-button>

								<van-button type="primary" block round v-else disabled>
									{{ t('已还款') }}
								</van-button>
							</template>
						</van-space>
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
						<p class="right-text">{{ rowData.borrowAmount || 0 }} {{ rowData.walletToken }}</p>
					</div>
					<div class="each-row">
						<p class="left-text">{{ t('总利息') }}:</p>
						<p class="right-text">{{ rowData.interest || 0 }} {{ rowData.walletToken }}</p>
					</div>
					<div class="each-row">
						<p class="left-text">{{ t('违约金') }}:</p>
						<p class="right-text">{{ rowData.overdueInterest || 0 }} {{ rowData.walletToken }}</p>
					</div>
					<div class="each-row">
						<p class="left-text">{{ t('需要还款') }}:</p>
						<p class="right-text">
							{{ plusForValueDecimal(rowData.overdueInterest, plusForValueDecimal(rowData.borrowAmount, rowData.interest)) }}
							{{ rowData.walletToken }}
						</p>
					</div>
				</div>
				<!-- <van-divider /> -->
				<van-button block round type="primary" @click="confirmRepayment">{{ t('确认') }}</van-button>
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
				</div>
			</div>
		</van-popup>
	</div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { userStore } from '@/store'
import arrow from '@/assets/images/user/arrow.png'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { formatDate, plusForValueDecimal } from '@/utils'
import useLoading from '@/hooks/useLoading.js'
import LoanTreaty from '@/views/user/loan/loan-treaty.vue'
import usePage from '@/hooks/usePage.js'
import { fetchLoanOrderListApi, repaymentLoanApi } from '@/apis/loan.js'
import { fetchUserKycApi } from '@/apis/user.js'
import Status from '@/components/Status/index.vue'
import { showToast } from 'vant'

const usersStore = userStore()
const router = useRouter()
const { t } = useI18n()
const loading = useLoading()

const { onRefresh, onLoad, listLoading, listError, finished, isEmptyList, refreshing, dataList } = usePage(fetchLoanOrderListApi)

const showPop = ref(false)

const confirmRepayment = async () => {
	try {
		loading.loading()
		// todo  接口待测试操作
		await repaymentLoanApi({
			orderId: rowData.value.orderId,
		})
		loading.clearLoading()
		showPop.value = false
		// showUserBalancePop.value = false

		showToast({
			icon: 'info',
			message: t('操作成功'),
			onClose: onRefresh,
		})
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
		loanAmount: rowData.value.borrowAmount, // 贷款金额
		loanDays: rowData.value.borrowDay, // 贷款天数
		loanDayRatio: rowData.value.dayRate, // 贷款天数比率
		interest: rowData.value.interest, // 利息
		repaymentAmount: plusForValueDecimal(rowData.value.borrowAmount, rowData.value.interest), // 还款金额
		latePaymentFee: rowData.value.overdueRate, // 滞纳金
		signImg: rowData.value.signatureImageUrl, // 签名照片地址
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
		const res = await fetchUserKycApi(params)
		if (res.data) {
			userKycRecordData.value = res.data
		}
	} catch (error) {
		console.log(error)
	}
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
				.order-status {
					margin-left: auto;
					font-size: 28px;

					&.wait {
						color: #82a9f9;
					}
					&.fail {
						color: #d42121;
					}
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
