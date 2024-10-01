<template>
	<div class="loan-treaty loan-treaty-wrap">
		<div class="loan-treaty_header">
			<i18n-t keypath="贷款条约.前言" tag="p" class="preface">
				<template v-slot:name>
					<span class="underline">{{ getSpace() }}{{ loanData.lenderName }}{{ getSpace() }}</span>
				</template>

				<template v-slot:time>
					<span class="underline">{{ getSpace() }}{{ loanData.loanDate }}{{ getSpace() }}</span>
				</template>
			</i18n-t>
			<p class="title" v-text="t('贷款条约.借款人')"></p>
			<i18n-t keypath="贷款条约.名" tag="p">
				<template v-slot:firstName>
					<span class="underline">{{ getSpace() }}{{ getSpace() }}{{ userData.firstName }}</span>
				</template>
			</i18n-t>

			<i18n-t keypath="贷款条约.姓" tag="p">
				<template v-slot:lastName>
					<span class="underline">{{ getSpace() }}{{ getSpace() }}{{ userData.lastName }}</span>
				</template>
			</i18n-t>

			<i18n-t keypath="贷款条约.地址" tag="p">
				<template v-slot:detailAddress>
					<span class="underline">{{ getSpace() }}{{ getSpace() }}{{ userData.detailAddress }}</span>
				</template>
			</i18n-t>

			<i18n-t keypath="贷款条约.电话" tag="p">
				<template v-slot:phone>
					<span class="underline">{{ getSpace() }}{{ getSpace() }}{{ userData.phone }}</span>
				</template>
			</i18n-t>
			<p class="title" v-text="t('贷款条约.贷方')"></p>
			<i18n-t keypath="贷款条约.贷方名称" tag="p">
				<template v-slot:name>
					<span class="underline">{{ getSpace() }}{{ loanData.lenderName }}</span>
				</template>
			</i18n-t>
			<p class="" v-text="t('贷款条约.双方统称')"></p>
		</div>

		<div class="loan-treaty_content">
			<p class="title" v-text="t('贷款条约.还款条款')"></p>
			<div class="">
				<!--贷款条约.还款条款内容-->
				<ul>
					<template v-for="(text, index) in RepaymentTermsList">
						<i18n-t :keypath="'贷款条约.还款条款内容[' + index + ']'" tag="li">
							<!--第1条-->
							<template #loanAmount v-if="index === 0">
								<span class="">{{ loanData.loanAmount }}</span>
							</template>

							<!--第2条-->
							<template #repaymentAmount v-if="index === 1">
								<span class="underline">${{ getSpace() }}{{ loanData.repaymentAmount }}{{ getSpace() }}</span>
							</template>

							<template #loanDayRatio v-if="index === 2">
								<span class="">{{ loanData.loanDayRatio }}{{ getUnit('%') }}</span>
							</template>

							<template #loanDayRatio v-if="index === 3">
								<span class="underline">{{ getSpace() }}{{ loanData.loanDayRatio }}{{ getUnit('%') }}{{ getSpace() }}</span>
							</template>

							<template #loanDays v-if="index === 4">
								<span class="">{{ loanData.loanDays }}</span>
							</template>
							<template #loanDays v-if="index === 5">
								<span class="underline">{{ getSpace() }}{{ loanData.loanDays }}{{ getSpace() }}</span>
							</template>

							<template #loanAmount v-if="index === 7">
								<span class="underline">${{ getSpace() }}{{ loanData.loanAmount }}{{ getSpace() }}</span>
							</template>
							<template #interest v-if="index === 7">
								<span class="underline">${{ getSpace() }}{{ loanData.interest }}{{ getSpace() }}</span>
							</template>
						</i18n-t>
					</template>
				</ul>
			</div>
			<p class="title" v-text="t('贷款条约.还款适用性')"></p>
			<div class="">
				<!--贷款条约.还款适用性内容-->
				<ul>
					<template v-for="(text, index) in RepaymentApplicabilityList">
						<i18n-t :keypath="'贷款条约.还款适用性内容[' + index + ']'" tag="li">
							<template #latePaymentFee v-if="index === 0">
								<span class="">{{ loanData.latePaymentFee }}{{ getUnit('%') }}</span>
							</template>

							<template #latePaymentFee v-if="index === 1">
								<span class="underline">{{ getSpace() }}{{ loanData.latePaymentFee }}{{ getUnit('%') }}{{ getSpace() }}</span>
							</template>
						</i18n-t>
					</template>
				</ul>
			</div>
		</div>

		<div class="loan-treaty_footer">
			<p class="" v-text="t('贷款条约.同意声明')"></p>
			<i18n-t keypath="贷款条约.贷方2" tag="p">
				<template v-slot:name>
					<span class="underline">{{ getSpace() }}{{ loanData.lenderName }}</span>
				</template>
			</i18n-t>

			<p class="">{{ t('贷款条约.借款人2') }}</p>
			<i18n-t keypath="贷款条约.借款人签名" tag="p">
				<template #signImg>
					<span v-if="form === FormType.ValidContract && loanData.signImg" class="underline">
						<img width="40px" height="40px" :src="loanData.signImg" alt="signImg" />
					</span>
					<span v-else class="underline">{{ getSpace() }}{{ loanData.signImg }}</span>
				</template>
			</i18n-t>
			<i18n-t keypath="贷款条约.签名时间" tag="p">
				<template #time>
					<span class="underline">{{ getSpace() }}{{ loanData.loanDate }}</span>
				</template>
			</i18n-t>
		</div>
	</div>
</template>

<script setup>
import { computed, ref, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, tm, rt } = useI18n()
const RepaymentTermsList = ref([])
RepaymentTermsList.value = tm('贷款条约.还款条款内容')

const RepaymentApplicabilityList = ref([])
RepaymentApplicabilityList.value = tm('贷款条约.还款适用性内容')

const FormType = ref({
	Template: 'template', // 模板合约
	ValidContract: 'validContract', // 有效合约
})

const props = defineProps({
	form: {
		type: String,
		default: 'validContract',
	},
	loanData: {
		type: Object,
		default() {
			return {
				lenderName: '', // 贷方名称
				loanDate: Date.now(), // 贷款日期
				loanAmount: 0, // 贷款金额
				loanDays: 0, // 贷款天数
				loanDayRatio: 0, // 贷款天数比率
				interest: 0, // 利息
				repaymentAmount: 0, // 还款金额
				latePaymentFee: 0, // 滞纳金
				signImg: '', // 签名照片地址
			}
		},
	},
	userData: {
		type: Object,
		default() {
			return {
				firstName: '',
				lastName: '',
				detailAddress: '',
				phone: '',
			}
		},
	},
})

const { loanData, userData, form } = toRefs(props)

// 模板时才会返回的三个空格
function getSpace() {
	return form.value === FormType.value.Template ? '   ' : ''
}

// 有效合约时才会返回该单位
function getUnit(unit) {
	return form.value === FormType.value.ValidContract ? unit : ''
}

function isUrl(url) {
	if (url) {
		let index = url.indexOf('http:;//') || url.indexOf('https:;//') || url.indexOf('/')
		return index === 0
	}
}
</script>

<style lang="scss">
.loan-treaty {
	&-wrap {
		color: #999;
		font-size: 28px;
		font-style: normal;
		font-weight: 500;
		line-height: 50px;

		ul {
			list-style-type: decimal;
		}
	}

	&_header {
		div,
		p {
			margin-top: 34px;
		}
		.preface {
			margin-top: 0;

			& + div,
			& + p {
				margin-top: 28px;
			}
		}
	}
	&_content {
		margin-top: 34px;

		.title {
			&:first-child {
				margin: 34px 0 28px;
			}
		}
	}
	&_footer {
		margin-top: 50px;
		margin-left: -40px;
	}
}
</style>
