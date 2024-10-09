<template>
	<div>
		<van-popup class="announcement-pop" v-model:show="showPop" @opened="opened" @closed="closed">
			<div class="node-add">
				<h2 class="title">{{ t('公告') }}</h2>
				<van-divider />
				<div class="rich-conetent" v-html="noticeData.content"></div>
				<van-divider />
				<van-button block round type="primary" @click="confirm">{{ t('确认') }}</van-button>
			</div>
		</van-popup>
	</div>
</template>
<script setup>
import { onBeforeMount, onMounted, ref } from 'vue'
import { fetchLatestNoticeApi } from '@/apis/common.js'
import { useI18n } from 'vue-i18n'
import { userStore } from '@/store/index.js'

const { t } = useI18n()
const usersStore = userStore()
const showPop = ref(false)

const opened = () => {}
const closed = () => {}
const confirm = () => {
	showPop.value = false
}

const noticeData = ref({
	content: '',
})
const noticeLatest = async () => {
	try {
		const res = await fetchLatestNoticeApi()
		if (res.data && res.data.content) {
			if (usersStore.firstNotice !== res.data.content) {
				showPop.value = true
			}
		}
		noticeData.value = res.data
		usersStore.SET_FIRST_NOTICE(res.data.content)
	} catch (error) {
		console.log(error)
	}
}

onBeforeMount(async () => {
	console.log('announcementPop', '========onMounted begin========')
	await noticeLatest()
	console.log('announcementPop', '========onMounted end========')
})
</script>
<style lang="scss" scoped>
:deep(.announcement-pop) {
	width: calc(100% - 40px);
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

		.title {
			height: 68px;
			margin-bottom: 20px;
		}

		.rich-conetent {
			width: 100%;
			min-height: 300px;
			max-height: 600px;
			overflow-y: scroll;
			padding: 20px 8px 20px;
			color: #000000;
			font-size: 32px;
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
	}
}
</style>
