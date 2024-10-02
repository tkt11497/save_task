<template>
	<div class="app">
		<div class="container" :class="{ 'withnav': isShowNav }">
			<router-view></router-view>
		</div>
		<Nav></Nav>
	</div>
</template>

<script setup name="App">
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { userStore, useWeb3Store } from '@/store/index.js'
import VConsole from 'vconsole'
import { showToast } from 'vant'
import { useRoute } from 'vue-router'

const usersStore = userStore()
const { flag } = storeToRefs(usersStore)

onMounted(() => {
	const vConsole = new VConsole()
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
const { address } = storeToRefs(web3Store)

const toastTimer = ref(null)
const clearToastTimer = () => {
	toastTimer.value && clearTimeout(toastTimer.value)
}
watch(
	() => route.name,
	(val) => {
		console.info('app---', val)

		if (val && val !== 'noWallet') {
			if (!address.value) {
				clearToastTimer()
				toastTimer.value = setTimeout(() => {
					showToast({ message: t('请正确连接你的钱包'), icon: 'info' })
				}, 1000)
			}
		}
	}
)
onMounted(async () => {
	console.log('app---onMounted', route.name)
	await web3Store.initUserAccountAndWallet()
})
onUnmounted(() => {
	clearToastTimer()
})
</script>

<style lang="scss" scoped>
.app {
	height: 100%;
	overflow-y: scroll;
}

.container {
	height: 100%;
	overflow-y: scroll;
}

.withnav {
	height: calc(100% - 140px);
}
</style>
