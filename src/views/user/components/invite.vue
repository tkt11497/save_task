<template>
	<div class="invite_container custom-page full-page">
		<van-nav-bar :fixed="true" :title="t('邀请朋友')" @click-left="onClickLeft">
			<template #left>
				<van-icon :name="arrow" size="23" />
			</template>
		</van-nav-bar>

		<div class="container">
			<div class="prize">
				<img src="../../../assets/images/user/prize.svg" alt="prize" />
			</div>
			<div class="title">{{ t('推荐并赚取') }}</div>
			<!--			<div class="text">{{ inviteCode.inviteText }}</div>-->
			<div class="link">{{ inviteLink }}</div>
			<div class="btn" @click="copyTextToClipboard">{{ t('复制链接') }}</div>
		</div>
	</div>
</template>

<script setup name="Invite">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { userStore } from '@/store'
import { useI18n } from 'vue-i18n'
import arrow from '@/assets/images/market/back.svg'
import useLoading from '@/hooks/useLoading.js'
import { clipboardText } from '@/utils/index.js' // Import image if needed

// 初始化仓库
const store = userStore()
const { t } = useI18n()
// 变量区
const router = useRouter()
const route = useRoute()
const loading = useLoading()
const state = ref('')
const usersStore = userStore()
const inviteCode = ref('')
const inviteLink = ref('')

const webSiteUrl = `${window.location.protocol}//${window.location.host}`
const getInvitationCode = async () => {
	try {
		inviteCode.value = usersStore.userInfo.inviteCode
		inviteLink.value = `${webSiteUrl}/?code=${inviteCode.value}`
		console.log('Invitation Code ', inviteCode.value)
	} catch (err) {
		console.log(err)
	}
}

const copyTextToClipboard = () => {
	clipboardText(inviteLink.value)
}

// 代码区

const onClickLeft = () => {
	history.back()
	store.SET_PATH_DATA('yes')
}

onMounted(() => {
	getInvitationCode()
})

// 将组件中的数据进行暴露出去
defineExpose({})
</script>

<style lang="scss" scoped>
.invite_container {
	.container {
		padding: 0 40px;
		//display: flex;
		//flex-direction: column;
		//align-items: center;
		//justify-content: space-evenly;
		margin-top: 60px;
		text-align: center;

		.prize {
			display: inline-block;
			width: 400px;
			//height: 390px;

			img {
				width: 100%;
				//height: 100%;
			}
		}

		.title {
			font-size: 42px;
			color: #000;
			font-weight: 700;
			margin-top: 84px;
		}

		.text {
			font-size: 24px;
			color: #999;
			margin-top: 44px;
			line-height: normal;
			letter-spacing: -0.12px;
			min-height: 32px;
		}

		.link {
			padding: 34px 22px;
			border-radius: 24px;
			border: 2px dashed #646464;
			background: linear-gradient(90deg, rgba(217, 229, 251, 0.75) 0%, rgba(116, 165, 255, 0.75) 100%);
			margin-top: 34px;
			min-height: 106px;

			color: var(--vt-header-black);
			font-size: 28px;
			font-style: normal;
			font-weight: 500;
			line-height: normal;
			letter-spacing: 0.42px;

			overflow: hidden;
			text-overflow: ellipsis; //文本溢出显示省略号
			white-space: nowrap; //文本不会换行
		}

		.btn {
			margin-top: 46px;
			padding: 36px 15px;
			background-image: url("@/assets/images/market/p_button.png");
			background-position:  center;
			background-size: 110% 130%;
			border:none;
			color: #fff;
			font-size: 28px;
			text-align: center;
			border-radius: 50px;
			line-height: normal;
			font-weight: 700;
		}
	}
}
</style>
<style>
/* Global CSS or in your component's style block */
.custom-message .el-message__icon {
	display: none;
	/* Hide the default icon */
}

.custom-message .custom-icon {
	width: 24px;
	/* Adjust size as needed */
	height: 24px;
	/* Adjust size as needed */
	margin-right: 8px;
	vertical-align: middle;
}

.custom-message .el-message__content {
	display: flex;
	align-items: center;
}

.el-message--info {
	width: 80%;
	background: #fff;
	background: var(--Backgrounds-Primary, #fff);
	box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
}
</style>
