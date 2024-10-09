<template>
	<div class="policy_container custom-page full-page">
		<div>
			<van-nav-bar :fixed="true" :title="t('隐私政策')" @click-left="onClickLeft">
				<template #left>
					<van-icon :name="arrow" size="23" />
				</template>
			</van-nav-bar>
		</div>

		<div></div>
		<div class="font">
			<template v-for="section in PrivacyPolicyList" :key="section.title">
				<div class="title">{{ section.title }}</div>
				<div class="text" v-for="(text, index) in section.text" :key="index" v-text="text"></div>
			</template>
			<!-- Introduction -->
			<!--      <div class="title">Introduction:</div>-->
			<!--      <div class="text">We are committed to protecting your privacy and ensuring the security of your personal-->
			<!--        information.-->
			<!--        This Privacy Policy outlines the types of information we collect, how we use it, and the measures we take to-->
			<!--        safeguard your data on our DeFi Blockchain website.</div>-->
			<!--      &lt;!&ndash; Information We Collect &ndash;&gt;-->
			<!--      <div class="title">Information We Collect:</div>-->
			<!--      <div class="text">We may collect the following types of information when you use our DeFi platform:-->
			<!--        a. Personal Information: This includes your name, email address, phone number, and other contact information-->
			<!--        that-->
			<!--        you voluntarily provide when registering for an account or participating in our services.</div>-->
			<!--      <div class="text">b. Transaction Information: We collect information related to your transactions on our platform,-->
			<!--        such as transaction amounts, digital asset types, and wallet addresses.-->
			<!--      </div>-->
			<!--      <div class="text">c. Technical Data: We gather information about your device, browser, and IP address, as well as-->
			<!--        usage data, such as your browsing activities, preferences, and interaction with our platform.</div>-->
			<!--      <div class="tex">d. Cookies and Similar Technologies: We use cookies and other tracking technologies to enhance-->
			<!--        your-->
			<!--        user experience, monitor platform performance, and facilitate user-->
			<!--        authentication</div>-->
			<!--      &lt;!&ndash; How We Use Your Information &ndash;&gt;-->
			<!--      <div class="title">How We Use Your Information:</div>-->
			<!--      <div class="text">We use the information we collect for the following purposes:-->
			<!--        a. To provide, maintain, and improve our DeFi platform and services. <br />-->
			<!--        b. To communicate with you and respond to your inquiries or support requests.<br />-->
			<!--        c. To enforce our terms and conditions and protect against fraud, security threats, or illegal activities.<br />-->
			<!--        d. To comply with legal and regulatory obligations.<br />-->
			<!--        e. To analyze platform usage and improve user experience.</div>-->
			<!--      &lt;!&ndash; Data Security &ndash;&gt;-->
			<!--      <div class="title">Data Security:</div>-->
			<!--      <div class="text">We implement industry-standard security measures, such as encryption and access controls, to-->
			<!--        protect-->
			<!--        your personal information from unauthorized access, disclosure, alteration, or destruction. However, please note-->
			<!--        that no method of data transmission or storage can guarantee absolute security.</div>-->
			<!--      &lt;!&ndash; Data Retention &ndash;&gt;-->
			<!--      <div class="title">Data Retention:</div>-->
			<!--      <div class="text">We retain your personal information for as long as necessary to fulfill the purposes for which-->
			<!--        it-->
			<!--        was collected, comply with legal obligations, or resolve disputes. Once your data is no longer required, we will-->
			<!--        delete or anonymize it.</div>-->
			<!--      &lt;!&ndash; Your Rights and Choices &ndash;&gt;-->
			<!--      <div class="title">Your Rights and Choices:</div>-->
			<!--      <div class="text">-->
			<!--        You may have certain rights concerning your personal information, including the right to access, correct, or-->
			<!--        delete-->
			<!--        your data, or object to its processing. To exercise these rights, please contact us at [Your Company Email-->
			<!--        Address].-->
			<!--      </div>-->
			<!--      &lt;!&ndash; Changes to This Privacy Policy &ndash;&gt;-->
			<!--      <div class="title">Changes to This Privacy Policy:</div>-->
			<!--      <div class="text">-->
			<!--        We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. We-->
			<!--        will-->
			<!--        notify you of any significant changes by posting an update on our platform or sending you an email notification.-->
			<!--      </div>-->
			<!--      <div class="text">By using our DeFi platform, you acknowledge and agree to the terms of this Privacy Policy.</div>-->
		</div>
	</div>
</template>

<script setup name="Policy">
import { defineExpose, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { userStore } from '@/store'
import arrow from '@/assets/images/market/back.svg'
import { useI18n } from 'vue-i18n'

const { t, tm } = useI18n()
// 初始化仓库
const store = userStore()
// 变量区
const router = useRouter()
const route = useRoute()
const state = ref('')

// 代码区
const onClickLeft = () => {
	history.back()
	store.SET_PATH_DATA('yes')
}

const PrivacyPolicyList = ref([])
PrivacyPolicyList.value = tm('隐私政策内容')
console.log(PrivacyPolicyList.value.length)

// 将组件中的数据进行暴露出去
defineExpose({})
</script>

<style lang="scss" scoped>
.policy_container {
	.font {
		padding: 0 60px 30px;
		font-size: 23px;
		color: #000;
		margin-top: 50px;

		.title {
			margin-top: 44px;
			font-size: 28px;
			font-weight: 600;
			line-height: normal;
			letter-spacing: -0.98px;
		}

		.title + .text {
			margin-top: 10px;
		}

		.text {
			color: #585858;
			font-size: 24px;
			font-style: normal;
			font-weight: 600;
			line-height: 41px;

			white-space: pre-wrap;
		}
	}
}
</style>
