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
import { ref, watch } from 'vue'
import { fetchLatestNoticeApi } from '@/apis/common.js'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const showPop = ref(true)

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
		// const params = {
		//     orderStatus:1
		// }
		const res = await fetchLatestNoticeApi()
		noticeData.value = res.data
	} catch (error) {
		console.log(error)
	}
}

watch(
	() => showPop.value,
	(val) => {
		if (val) {
			noticeLatest()
		}
	},
	{
		immediate: true,
	}
)
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
