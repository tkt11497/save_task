<template>
	<div class="app">
		<div class="container" :class="{ 'withnav': isShowNav }">
			<router-view></router-view>
		</div>
		<Nav></Nav>

		<van-popup class="no-address-pop" v-model:show="showPop">
			<div class="node-add">
				<h2 class="title">
					<img src="@/assets/images/user/fail.png" class="icon" alt="fail" />
					<span>{{ t('失败') }}</span>
				</h2>
				<van-divider />
				<div class="rich-conetent">
					{{ t('钱包授权失败，请重新连接。') }}
				</div>
				<van-button block round type="primary" @click="confirm">{{ t('确认') }}</van-button>
			</div>
		</van-popup>
	</div>
</template>

<script setup name="App">
import { onBeforeMount, onMounted, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { userStore, useWeb3Store } from '@/store/index.js'
import VConsole from 'vconsole'
import { useRoute } from 'vue-router'
import router from '@/router/index.js'
import { useI18n } from 'vue-i18n'
import { flexible } from '@/utils/adjust_html_font.js'
const usersStore = userStore()
const { flag } = storeToRefs(usersStore)
const { t } = useI18n()

onMounted(() => {
	// todo 正式环境去除
	//const vConsole = new VConsole()
	flexible(window,document)
})

const isShowNav = ref(false)
watch(
	() => flag.value,
	(val) => {
		isShowNav.value = val !== 'no'
	},
	{
		immediate: true,
	}
)

const route = useRoute()
const web3Store = useWeb3Store()
const { address, currentCurrency } = storeToRefs(web3Store)

const showPop = ref(false)
const confirm = () => {
	showPop.value = false
	router.push('/noWallet')
}

onBeforeMount(async () => {
	await web3Store.initUserAccountAndWallet()
})
onUnmounted(() => {})
</script>

<style lang="scss" scoped>
.app {
	height: 100%;
	overflow-y: scroll;
}

.container {
	height: 100%;
	background: linear-gradient(5deg, rgba(251,229,173,1) 41%, rgba(242,242,242,1) 82%);
	overflow-y: scroll;
}

.withnav {
	height: calc(100% - 140px);
}

:deep(.no-address-pop) {
	width: calc(100% - 40px);
	min-height: 400px;
	border-radius: 26px;

	.node-add {
		border-radius: 26px;
		font-size: 26px;
		padding: 54px 14px 80px;
		display: flex;
		flex-direction: column;
		align-items: center;

		.title {
			height: 68px;
			margin-bottom: 20px;
			display: flex;
			align-items: center;
			color: #d42121;
			font-size: 36px;

			img {
				width: 43px;
				height: 45px;
				margin-right: 10px;
			}
		}

		.rich-conetent {
			width: 100%;
			//min-height: 300px;
			//max-height: 600px;
			overflow-y: scroll;
			padding: 20px 8px 20px;
			color: #000000;
			font-size: 28px;
			margin-bottom: 40px;
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
